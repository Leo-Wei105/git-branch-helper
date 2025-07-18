import * as vscode from 'vscode';
import * as path from 'path';
import { simpleGit, SimpleGit } from 'simple-git';
import { BranchPrefix, BranchCreationOptions, BranchCreationResult, GitBranch, DateFormat } from './types';
import { ConfigManager } from './configManager';
import { Utils } from './utils';

export class BranchCreator {
    private git: SimpleGit | null = null;
    private configManager: ConfigManager;

    constructor(configManager: ConfigManager) {
        this.configManager = configManager;
    }

    /**
     * 初始化Git实例
     */
    private async initializeGit(): Promise<SimpleGit> {
        if (this.git) {
            return this.git;
        }

        // 获取工作区根目录
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('请先打开一个工作区');
        }

        const workspaceRoot = workspaceFolder.uri.fsPath;
        
        // 检查是否为Git仓库
        try {
            this.git = simpleGit(workspaceRoot);
            const isRepo = await this.git.checkIsRepo();
            
            if (!isRepo) {
                throw new Error('当前目录不是Git仓库');
            }
            
            return this.git;
        } catch (error) {
            throw new Error(`Git初始化失败: ${error}`);
        }
    }

    /**
     * 获取Git用户名
     */
    private async getGitUsername(): Promise<string> {
        const config = this.configManager.getConfiguration();
        
        // 如果设置了自定义用户名，使用自定义用户名
        if (config.customGitName) {
            return config.customGitName;
        }

        // 否则从Git配置获取
        const git = await this.initializeGit();
        try {
            const username = await git.getConfig('user.name');
            if (!username.value) {
                throw new Error('未设置Git用户名，请先配置Git用户名或在插件设置中指定');
            }
            return username.value;
        } catch (error) {
            throw new Error('获取Git用户名失败，请检查Git配置');
        }
    }

    /**
     * 获取所有分支
     */
    private async getAllBranches(): Promise<GitBranch[]> {
        const git = await this.initializeGit();
        
        try {
            const branchSummary = await git.branch(['-a']);
            const branches: GitBranch[] = [];

            // 本地分支
            Object.keys(branchSummary.branches).forEach(branchName => {
                const branch = branchSummary.branches[branchName];
                if (!branchName.startsWith('remotes/')) {
                    branches.push({
                        name: branchName,
                        current: branch.current,
                        isRemote: false,
                        commit: branch.commit
                    });
                }
            });

            // 远程分支
            Object.keys(branchSummary.branches).forEach(branchName => {
                const branch = branchSummary.branches[branchName];
                if (branchName.startsWith('remotes/')) {
                    const remoteBranchName = branchName.replace('remotes/', '');
                    branches.push({
                        name: remoteBranchName,
                        current: false,
                        isRemote: true,
                        commit: branch.commit
                    });
                }
            });

            return branches;
        } catch (error) {
            throw new Error(`获取分支列表失败: ${error}`);
        }
    }

    /**
     * 检查分支是否存在
     */
    private async branchExists(branchName: string): Promise<boolean> {
        const branches = await this.getAllBranches();
        return branches.some(branch => branch.name === branchName);
    }

    /**
     * 创建并切换到新分支
     */
    private async createAndCheckoutBranch(branchName: string, baseBranch: string): Promise<void> {
        const git = await this.initializeGit();
        const config = this.configManager.getConfiguration();

        try {
            // 创建新分支
            await git.checkoutBranch(branchName, baseBranch);
            
            // 显示成功消息
            const message = `成功创建分支: ${branchName}`;
            if (config.autoCheckout) {
                vscode.window.showInformationMessage(`${message} (已自动切换)`);
            } else {
                vscode.window.showInformationMessage(message);
            }
        } catch (error) {
            throw new Error(`创建分支失败: ${error}`);
        }
    }

    /**
     * 选择分支前缀
     */
    private async selectBranchPrefix(): Promise<BranchPrefix | undefined> {
        const prefixes = this.configManager.getBranchPrefixes();
        
        if (prefixes.length === 0) {
            throw new Error('没有可用的分支前缀，请先配置分支前缀');
        }

        // 如果只有一个前缀，直接使用
        if (prefixes.length === 1) {
            return prefixes[0];
        }

        // 创建选择项
        const items = prefixes.map(prefix => ({
            label: prefix.prefix,
            description: prefix.description,
            detail: prefix.isDefault ? '默认' : '',
            prefix: prefix
        }));

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: '选择分支前缀',
            matchOnDescription: true
        });

        return selected?.prefix;
    }

    /**
     * 选择基分支
     */
    private async selectBaseBranch(): Promise<string | undefined> {
        const branches = await this.getAllBranches();
        
        if (branches.length === 0) {
            throw new Error('没有可用的分支');
        }

        // 按本地分支优先排序
        const sortedBranches = branches.sort((a, b) => {
            if (a.current) {return -1;}
            if (b.current) {return 1;}
            if (!a.isRemote && b.isRemote) {return -1;}
            if (a.isRemote && !b.isRemote) {return 1;}
            return a.name.localeCompare(b.name);
        });

        // 创建选择项
        const items = sortedBranches.map(branch => ({
            label: branch.name,
            description: branch.isRemote ? '远程分支' : '本地分支',
            detail: branch.current ? '当前分支' : '',
            branchName: branch.name
        }));

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: '选择基分支',
            matchOnDescription: true
        });

        return selected?.branchName;
    }

    /**
     * 输入分支描述
     */
    private async inputBranchDescription(prefix: string, username: string): Promise<string | undefined> {
        const config = this.configManager.getConfiguration();
        const currentDate = Utils.formatDate(new Date(), config.dateFormat as DateFormat);

        let previewBranchName = '';
        
        const description = await vscode.window.showInputBox({
            prompt: '输入分支描述信息',
            placeHolder: '例如：用户登录功能',
            validateInput: (value) => {
                if (!value) {
                    return '描述信息不能为空';
                }
                
                const validation = Utils.validateDescription(value);
                if (!validation.isValid) {
                    return validation.error;
                }

                // 实时预览分支名称
                const previewName = Utils.generateBranchName({
                    prefix,
                    description: value,
                    username,
                    date: currentDate
                });

                const branchValidation = Utils.validateBranchName(previewName);
                if (!branchValidation.isValid) {
                    return branchValidation.error;
                }

                previewBranchName = previewName;
                return null;
            }
        });

        return description;
    }

    /**
     * 确认创建分支
     */
    private async confirmBranchCreation(options: BranchCreationOptions): Promise<boolean> {
        const branchName = Utils.generateBranchName(options);
        
        const items = [
            `基分支: ${options.baseBranch}`,
            `新分支: ${branchName}`,
            `描述: ${options.description}`,
            `创建者: ${options.username}`
        ];

        const confirmed = await vscode.window.showInformationMessage(
            '确认创建分支？',
            {
                modal: true,
                detail: items.join('\n')
            },
            '确认',
            '取消'
        );

        return confirmed === '确认';
    }

    /**
     * 主要的分支创建流程
     */
    async createBranch(): Promise<BranchCreationResult> {
        try {
            // 步骤1: 选择分支前缀
            const selectedPrefix = await this.selectBranchPrefix();
            if (!selectedPrefix) {
                return { success: false, error: '未选择分支前缀' };
            }

            // 步骤2: 选择基分支
            const baseBranch = await this.selectBaseBranch();
            if (!baseBranch) {
                return { success: false, error: '未选择基分支' };
            }

            // 步骤3: 获取用户名
            const username = await this.getGitUsername();

            // 步骤4: 输入描述信息
            const description = await this.inputBranchDescription(selectedPrefix.prefix, username);
            if (!description) {
                return { success: false, error: '未输入描述信息' };
            }

            // 步骤5: 生成分支名称
            const config = this.configManager.getConfiguration();
            const currentDate = Utils.formatDate(new Date(), config.dateFormat as DateFormat);
            
            const branchCreationOptions: BranchCreationOptions = {
                prefix: selectedPrefix.prefix,
                baseBranch,
                description,
                username,
                date: currentDate
            };

            const branchName = Utils.generateBranchName(branchCreationOptions);

            // 步骤6: 检查分支是否存在
            const exists = await this.branchExists(branchName);
            if (exists) {
                const action = await vscode.window.showWarningMessage(
                    `分支 ${branchName} 已存在`,
                    '切换到该分支',
                    '重新输入',
                    '取消'
                );

                if (action === '切换到该分支') {
                    const git = await this.initializeGit();
                    await git.checkout(branchName);
                    vscode.window.showInformationMessage(`已切换到分支: ${branchName}`);
                    return { success: true, branchName };
                } else if (action === '重新输入') {
                    return await this.createBranch();
                } else {
                    return { success: false, error: '取消创建' };
                }
            }

            // 步骤7: 确认创建
            const confirmed = await this.confirmBranchCreation(branchCreationOptions);
            if (!confirmed) {
                return { success: false, error: '用户取消创建' };
            }

            // 步骤8: 创建分支
            await this.createAndCheckoutBranch(branchName, baseBranch);

            return { success: true, branchName };

        } catch (error) {
            return { success: false, error: String(error) };
        }
    }
} 