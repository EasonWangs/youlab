# You Lab Jekyll Site


## 本地运行

```bash
bundle install
bundle exec jekyll serve
```

然后打开 `http://127.0.0.1:4000`。原站链接仍保留 `.htm` 路径，例如 `Research.htm`、`zh/Research.htm`；首页以 `index.html` 和 `zh/index.html` 为正式入口。

## 部署到 GitHub Pages

项目已经包含 `.github/workflows/pages.yml`，推荐使用 GitHub Actions 构建并发布到 GitHub Pages。

首次部署：

```bash
git init
git add .
git commit -m "Initial You Lab Jekyll site"
git branch -M main
git remote add origin https://github.com/<USER>/<REPOSITORY>.git
git push -u origin main
```

然后进入 GitHub 仓库页面：

1. 打开 `Settings` → `Pages`
2. 在 `Build and deployment` 里把 `Source` 选为 `GitHub Actions`
3. 回到 `Actions` 查看 `Deploy Jekyll site to GitHub Pages`
4. 部署成功后，Pages 页面会显示访问地址

如果发布到普通项目仓库，例如 `https://<USER>.github.io/<REPOSITORY>/`，当前站点主要使用相对路径，通常不需要额外修改 `baseurl`。如果后续改为大量绝对路径或自定义域名，再同步调整 `_config.yml` 的 `url` / `baseurl`。

## 常用目录

- `_layouts/common.html`: 全站 Jekyll 页面模板
- `_pages/`: 普通页面源文件，通过 `permalink` 输出原站 `.htm/.html` 路径
- `_includes/youlab-header.html`: 公共页头
- `_includes/youlab-nav.html`: 公共导航
- `_includes/youlab-footer.html`: 公共页脚
- `_includes/concepts-list.html`: Concepts/Resources 列表组件
- `_includes/news-list.html`: 新闻列表分页组件
- `_includes/home-news-list.html`: 首页新闻组件
- `_includes/home-research.html`: 首页 Life in the Lab / 实验室生活组件
- `_includes/resources-energy-converter.html`: Resources / Energy Converter 共用页面组件
- `_data/site.yml`: 公共页头、导航、页脚、合作链接和联系信息配置
- `_data/concepts.yml`: Concepts/Resources 列表筛选分类配置
- `_data/resources.yml`: Resources / Energy Converter 中英文文案配置
- `_layouts/article.html`: 新闻和 Concepts/Resources 详情页模板
- `_posts/news/en/`: 英文新闻 Markdown 源文件
- `_posts/news/zh/`: 中文新闻 Markdown 源文件
- `_posts/concepts/en/`: 英文 Concepts/Resources Markdown 源文件
- `_posts/concepts/zh/`: 中文 Concepts/Resources Markdown 源文件
- `assets/css/`: 全站样式
- `assets/js/`: 站点脚本
- `assets/vendor/swiper/`: Swiper 依赖
- `assets/fonts/`: 本地字体与 iconfont
- `assets/images/decor/`: logo、图标、背景、箭头等装饰资源
- `assets/images/page/`: 首页、团队和普通页面内容图
- `assets/images/articles/`: 新闻、资源和详情页文章图片
- `assets/images/articles/news/<id>/`: 新闻详情页图片，中英文对应文章共用同一份图片
- `assets/images/articles/concepts/<id>/`: Concepts/Resources 详情页图片，中英文对应文章共用同一份图片
- `assets/pdfs/publications/`: 论文 PDF

详情页源文件已经迁移到 `_posts/`，通过 front matter 中的 `permalink` 输出 `.htm` URL。中英文对应文章共用同一个数字 id，例如 `/info/news/1013.htm` 与 `/zh/info/news/1013.htm`。

Post 文件名使用 `YYYY-MM-DD-数字id.md`，数字 id 同时保留在 front matter 的 `article_id` 和 `permalink` 中。新闻和 Concepts/Resources 分别从 `1001` 开始编号，中英文对应文章共用同一个数字 id。

新闻列表页由 `_includes/news-list.html` 从 `_posts/news/` 自动生成。新增新闻时，在对应 post 的 front matter 中设置 `article_kind: news`、`lang`、`article_id`、`permalink` 和 `cover_image` 即可进入列表。

首页 News 模块由 `_includes/home-news-list.html` 从 `_posts/news/` 自动读取对应语言最新 5 篇新闻，新增新闻后无需手动维护首页卡片。

首页 Life in the Lab / 实验室生活模块由 `_includes/home-research.html` 渲染，内容集中维护在 `_data/home_research.yml`，适合这种固定板块的标题、说明和轮播图片。

普通页面源文件集中放在 `_pages/`：例如 `_pages/research-en.html` 通过 `permalink` 输出 `/Research.htm`，中文页面同理。`_includes/` 只保留可复用组件，避免把整页主体藏进 include 目录。`Resources/Concepts.htm` 和 `zh/Resources/Concepts.htm` 从 `_posts/concepts/` 自动读取文章列表，筛选分类维护在 `_data/concepts.yml`。

中英文页面如果结构一致，保留两个 `_pages/` 入口负责不同 URL、语言和标题，把共同结构放到 `_includes/`，把差异文案放到 `_data/`。例如 `Resources.htm`、`zh/Resources.htm`、`Resources/EnergyConverter.htm` 和 `zh/Resources/EnergyConverter.htm` 共用 `_includes/resources-energy-converter.html`，文案来自 `_data/resources.yml`，计算逻辑来自 `assets/js/energy-converter.js`。

分页不依赖自定义插件，适合直接部署到 GitHub Pages。分页路径配置在 `_data/news_pages.yml`，真实分页从 `News/1.htm`、`News/2.htm` 开始，`News.htm` 和 `zh/News.htm` 只作为旧入口兼容跳转保留。当前已预置 10 页，每页 6 条，最多可容纳每种语言 60 篇新闻。新增新闻只需要添加 post，列表内容和分页内容会自动顺延；超过 60 篇时，再扩展 `_data/news_pages.yml` 并在 `_pages/news/` 补充对应分页源文件即可。
