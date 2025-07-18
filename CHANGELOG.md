# 更新日志

## [1.0.0] - 2025-06-04

### 新增功能
- 🎉 初始版本发布
- ✨ 支持快速创建标准化命名的Git分支
- 🔧 可配置的分支前缀管理
- 🎯 多种触发方式（快捷键、命令面板、菜单）
- 📝 完整的输入验证功能
- 🌐 中英文界面支持

### 核心功能
- **分支命名规则**：支持 `前缀/日期/描述信息_Git用户名` 格式
- **分支前缀管理**：默认支持 feature、feat、bugfix、hotfix、fix 等前缀
- **基分支选择**：支持选择任意本地或远程分支作为基分支
- **实时验证**：输入描述时实时验证并预览分支名称
- **自动切换**：创建分支后可自动切换到新分支

### 配置选项
- `gitBranchCreator.branchPrefixes` - 分支前缀列表配置
- `gitBranchCreator.customGitName` - 自定义Git用户名
- `gitBranchCreator.dateFormat` - 日期格式选择
- `gitBranchCreator.autoCheckout` - 自动切换分支设置

### 操作方式
- **快捷键**：`Ctrl+Shift+F` (Windows/Linux) / `Cmd+Shift+F` (Mac)
- **命令面板**：`Git: 创建功能分支`
- **源代码管理视图**：集成按钮
- **右键菜单**：文件资源管理器上下文菜单

### 技术特性
- 基于 TypeScript 开发
- 使用 simple-git 进行Git操作
- 完整的错误处理和用户反馈
- 支持VSCode 1.74.0及以上版本

### 已知问题
- 暂无

### 计划改进
- 支持批量操作
- 集成Issue关联功能
- 增加更多日期格式选项
- 添加分支模板系统 