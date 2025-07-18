import * as vscode from 'vscode';
import { BranchCreator } from './branchCreator';
import { ConfigManager } from './configManager';

export function activate(context: vscode.ExtensionContext) {
    console.log('Git Branch Creator 插件已激活');

    const configManager = new ConfigManager();
    const branchCreator = new BranchCreator(configManager);

    // 注册创建分支命令
    const createBranchCommand = vscode.commands.registerCommand(
        'gitBranchCreator.createBranch',
        async () => {
            try {
                await branchCreator.createBranch();
            } catch (error) {
                vscode.window.showErrorMessage(`创建分支失败: ${error}`);
            }
        }
    );

    // 注册管理前缀命令
    const managePrefixesCommand = vscode.commands.registerCommand(
        'gitBranchCreator.managePrefixes',
        async () => {
            try {
                await configManager.managePrefixes();
            } catch (error) {
                vscode.window.showErrorMessage(`管理前缀失败: ${error}`);
            }
        }
    );

    // 注册状态栏项
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        100
    );
    statusBarItem.command = 'gitBranchCreator.createBranch';
    statusBarItem.text = '$(git-branch) 创建分支';
    statusBarItem.tooltip = '快速创建Git分支';
    statusBarItem.show();

    // 添加到清理列表
    context.subscriptions.push(
        createBranchCommand,
        managePrefixesCommand,
        statusBarItem
    );
}

export function deactivate() {
    console.log('Git Branch Creator 插件已停用');
} 