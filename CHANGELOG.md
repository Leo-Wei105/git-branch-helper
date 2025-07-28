# 更新日志

所有重要的项目更改都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 新增
- 待添加的新功能

### 修改
- 待修改的功能

### 修复
- 待修复的问题

## [1.1.1] - 2025-07-28

### 更新
- 基于远程分支创建的分支在创建成功后应该取消关联远程分支## [1.1.0] - 2025-07-26

### 修改
- 版本升级和功能优化## [1.0.0] - 2025-06-04

### 新增
- 🎉 初始版本发布
- ✨ 支持快速创建标准化命名的Git分支
- 🔧 可配置的分支前缀管理
- 🎯 多种触发方式（快捷键、命令面板、菜单）
- 📝 完整的输入验证功能
- 🌐 中英文界面支持
- 分支命名规则：支持 `前缀/日期/描述信息_Git用户名` 格式
- 分支前缀管理：默认支持 feature、feat、bugfix、hotfix、fix 等前缀
- 基分支选择：支持选择任意本地或远程分支作为基分支
- 实时验证：输入描述时实时验证并预览分支名称
- 自动切换：创建分支后可自动切换到新分支
- 快捷键：`Ctrl+Alt+Shift+B` (Windows/Linux) / `Cmd+Alt+Shift+B` (Mac)
- 命令面板：`Git: 创建功能分支`
- 源代码管理视图：集成按钮
- 右键菜单：文件资源管理器上下文菜单

### 修改
- 配置选项：
  - `gitBranchHelper.branchPrefixes` - 分支前缀列表配置
  - `gitBranchHelper.customGitName` - 自定义Git用户名
  - `gitBranchHelper.dateFormat` - 日期格式选择
  - `gitBranchHelper.autoCheckout` - 自动切换分支设置
- 技术特性：
  - 基于 TypeScript 开发
  - 使用 simple-git 进行Git操作
  - 完整的错误处理和用户反馈
  - 支持VSCode 1.74.0及以上版本 