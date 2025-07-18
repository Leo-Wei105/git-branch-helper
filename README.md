# Git Branch Creator

一个用于快速创建标准化命名分支的VSCode插件，支持自定义分支前缀、自动生成分支名称、基分支选择等功能，提高开发效率。

## 功能特性

- 🚀 **快速创建分支**：一键创建标准化命名的Git分支
- 📋 **规范统一**：统一团队分支命名规范
- 🎯 **简单易用**：直观的用户界面，易于上手
- 🔧 **灵活配置**：支持自定义分支前缀和配置
- ⚡ **高效操作**：快捷键和菜单多种触发方式

## 分支命名规则

插件生成的分支名称遵循以下格式：
```
前缀/日期/描述信息_Git用户名
```

### 示例
- `feature/20250604/用户登录功能_john`
- `bugfix/20250604/修复登录bug_mary`
- `hotfix/20250604/紧急修复_alex`

## 快速开始

### 1. 安装插件

在VSCode扩展商店中搜索 "Git Branch Creator" 并安装。

### 2. 使用方法

#### 方式一：快捷键
- Windows/Linux: `Ctrl+Shift+F`
- Mac: `Cmd+Shift+F`

#### 方式二：命令面板
1. 打开命令面板 (`Ctrl+Shift+P` 或 `Cmd+Shift+P`)
2. 输入 "Git: 创建功能分支"
3. 选择并执行

#### 方式三：源代码管理视图
在源代码管理视图中点击 "创建分支" 按钮

#### 方式四：右键菜单
在文件资源管理器中右键点击文件夹，选择 "创建功能分支"

### 3. 操作步骤

1. **选择分支前缀**：从配置的前缀列表中选择（如 feature、bugfix、hotfix）
2. **选择基分支**：选择要基于的分支（默认为当前分支）
3. **输入描述信息**：输入分支的描述信息
4. **确认创建**：确认分支信息并创建

## 配置说明

### 分支前缀配置

插件提供默认的分支前缀：
- `feature` - 功能分支（默认）
- `feat` - 功能分支简写
- `bugfix` - 修复分支
- `hotfix` - 热修复分支
- `fix` - 修复分支简写

### 自定义配置

在VSCode设置中可以配置：

- `gitBranchCreator.branchPrefixes` - 分支前缀列表
- `gitBranchCreator.customGitName` - 自定义Git用户名
- `gitBranchCreator.dateFormat` - 日期格式（yyyyMMdd、yyyy-MM-dd、yyMMdd）
- `gitBranchCreator.autoCheckout` - 创建后自动切换分支

### 管理前缀

使用命令 "Git: 管理分支前缀" 可以：
- 添加新的分支前缀
- 删除现有前缀
- 设置默认前缀
- 重置为默认配置

## 输入验证

插件会验证输入的描述信息：
- ✅ 允许字母、数字、中文、下划线(_)、短横线(-)
- ❌ 不允许空格、特殊符号
- ❌ 长度限制为1-50个字符

## 开发

### 构建和运行

1. 克隆项目：
   ```bash
   git clone [repository-url]
   cd git-branch-creator
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 编译：
   ```bash
   npm run compile
   ```

4. 在VSCode中按 `F5` 启动调试

### 目录结构

```
├── src/
│   ├── extension.ts      # 主扩展文件
│   ├── branchCreator.ts  # 分支创建逻辑
│   ├── configManager.ts  # 配置管理
│   ├── utils.ts          # 工具函数
│   └── types.ts          # 类型定义
├── package.json          # 插件配置
├── tsconfig.json         # TypeScript配置
└── README.md
```

## 许可证

MIT License

## 问题反馈

如果您在使用过程中遇到问题或有功能建议，请在GitHub上提交Issue。

## 更新日志

### 1.0.0
- 初始版本发布
- 支持基本的分支创建功能
- 可配置的分支前缀
- 完整的输入验证 