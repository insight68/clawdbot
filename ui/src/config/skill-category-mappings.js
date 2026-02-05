/**
 * Skills 按职业分类映射表
 *
 * 用于将 OpenClaw Skills 按职业角度分类，方便左侧导航展示
 */
// 所有职业类别信息
export const JOB_CATEGORIES = [
    { id: "marketing", name: "营销", emoji: "📢", description: "营销活动、内容生成、广告投放" },
    { id: "service", name: "客服", emoji: "💬", description: "客户支持、售后处理" },
    { id: "brand", name: "品牌", emoji: "✨", description: "品牌形象、声誉管理" },
    { id: "data", name: "数据", emoji: "📊", description: "数据分析、报表生成" },
    { id: "admin", name: "行政", emoji: "📋", description: "办公自动化、文档处理" },
    { id: "dev", name: "开发", emoji: "💻", description: "代码开发、技术工具" },
    { id: "communication", name: "通讯", emoji: "📱", description: "即时通讯、消息发送" },
    { id: "media", name: "媒体", emoji: "🎬", description: "音视频处理、图像编辑" },
    { id: "tools", name: "工具", emoji: "🛠️", description: "实用工具、系统工具" },
    { id: "other", name: "其他", emoji: "📦", description: "其他技能" },
];
// 完整映射表（按类别分组）
export const SKILL_JOB_CATEGORY_MAPPINGS = [
    // 营销 (26)
    { skillName: "content-strategy", category: "marketing", icon: "📝", displayName: "内容营销策略" },
    { skillName: "copywriting", category: "marketing", icon: "✍️", displayName: "文案写作" },
    { skillName: "copy-editing", category: "marketing", icon: "📝", displayName: "文案编辑" },
    { skillName: "social-content", category: "marketing", icon: "📱", displayName: "社交媒体内容" },
    { skillName: "email-sequence", category: "marketing", icon: "📧", displayName: "邮件序列" },
    {
        skillName: "instagram-marketing",
        category: "marketing",
        icon: "📸",
        displayName: "Instagram营销",
    },
    {
        skillName: "product-marketing-context",
        category: "marketing",
        icon: "📋",
        displayName: "产品营销上下文",
    },
    { skillName: "launch-strategy", category: "marketing", icon: "🚀", displayName: "发布策略" },
    { skillName: "pricing-strategy", category: "marketing", icon: "💰", displayName: "定价策略" },
    {
        skillName: "competitive-alternatives",
        category: "marketing",
        icon: "🔄",
        displayName: "竞品对比",
    },
    { skillName: "referral-program", category: "marketing", icon: "👥", displayName: "推荐计划" },
    {
        skillName: "free-tool-strategy",
        category: "marketing",
        icon: "🎁",
        displayName: "免费工具策略",
    },
    { skillName: "programmatic-seo", category: "marketing", icon: "🔍", displayName: "程序化SEO" },
    { skillName: "seo-audit", category: "marketing", icon: "📊", displayName: "SEO审计" },
    { skillName: "schema-markup", category: "marketing", icon: "🏷️", displayName: "结构化数据" },
    { skillName: "analytics-tracking", category: "marketing", icon: "📈", displayName: "分析追踪" },
    { skillName: "form-cro", category: "marketing", icon: "📝", displayName: "表单优化" },
    { skillName: "page-cro", category: "marketing", icon: "📄", displayName: "落地页优化" },
    { skillName: "popup-cro", category: "marketing", icon: "🪟", displayName: "弹窗优化" },
    { skillName: "onboarding-cro", category: "marketing", icon: "🎯", displayName: "用户引导优化" },
    { skillName: "signup-flow-cro", category: "marketing", icon: "✅", displayName: "注册流程优化" },
    {
        skillName: "paywall-upgrade-cro",
        category: "marketing",
        icon: "💎",
        displayName: "付费墙优化",
    },
    { skillName: "paid-ads", category: "marketing", icon: "💵", displayName: "付费广告" },
    { skillName: "marketing-ideas", category: "marketing", icon: "💡", displayName: "营销创意库" },
    {
        skillName: "marketing-psychology",
        category: "marketing",
        icon: "🧠",
        displayName: "营销心理学",
    },
    { skillName: "ab-test-setup", category: "marketing", icon: "🧪", displayName: "A/B测试" },
    { skillName: "user-research", category: "marketing", icon: "🔬", displayName: "用户研究" },
    // 客服 (3)
    { skillName: "imsg", category: "service", icon: "💬", displayName: "iMessage客服" },
    { skillName: "wacli", category: "service", icon: "📱", displayName: "WhatsApp客服" },
    { skillName: "bluebubbles", category: "service", icon: "📱", displayName: "BlueBubbles" },
    // 品牌 (2)
    { skillName: "social-content", category: "brand", icon: "📱", displayName: "社交媒体品牌" },
    { skillName: "competitive-alternatives", category: "brand", icon: "🔄", displayName: "竞品分析" },
    // 数据 (5)
    { skillName: "analytics-tracking", category: "data", icon: "📈", displayName: "数据分析" },
    { skillName: "seo-audit", category: "data", icon: "📊", displayName: "SEO数据审计" },
    { skillName: "session-logs", category: "data", icon: "📜", displayName: "会话日志分析" },
    { skillName: "model-usage", category: "data", icon: "💸", displayName: "成本追踪" },
    { skillName: "ultimapper", category: "data", icon: "🗺️", displayName: "数据可视化" },
    // 行政 (10)
    { skillName: "apple-notes", category: "admin", icon: "📝", displayName: "Apple笔记" },
    { skillName: "bear-notes", category: "admin", icon: "🐻", displayName: "Bear笔记" },
    { skillName: "notion", category: "admin", icon: "📔", displayName: "Notion" },
    { skillName: "obsidian", category: "admin", icon: "💎", displayName: "Obsidian" },
    { skillName: "apple-reminders", category: "admin", icon: "⏰", displayName: "提醒事项" },
    { skillName: "things-mac", category: "admin", icon: "✅", displayName: "Things任务" },
    { skillName: "trello", category: "admin", icon: "📋", displayName: "Trello看板" },
    { skillName: "himalaya", category: "admin", icon: "📧", displayName: "邮件CLI" },
    { skillName: "nano-pdf", category: "admin", icon: "📄", displayName: "PDF编辑" },
    { skillName: "1password", category: "admin", icon: "🔐", displayName: "密码管理" },
    // 开发 (15)
    { skillName: "github", category: "dev", icon: "🐙", displayName: "GitHub" },
    { skillName: "clawhub", category: "dev", icon: "🤖", displayName: "ClawHub" },
    { skillName: "coding-agent", category: "dev", icon: "💻", displayName: "AI编程助手" },
    { skillName: "openai-whisper", category: "dev", icon: "🎙️", displayName: "Whisper本地" },
    { skillName: "openai-whisper-api", category: "dev", icon: "☁️", displayName: "Whisper API" },
    { skillName: "openai-image-gen", category: "dev", icon: "🖼️", displayName: "OpenAI图像" },
    { skillName: "gemini", category: "dev", icon: "✨", displayName: "Gemini" },
    { skillName: "nano-banana-pro", category: "dev", icon: "🍌", displayName: "Banana Pro" },
    { skillName: "oracle", category: "dev", icon: "🧿", displayName: "代码分析" },
    { skillName: "mcporter", category: "dev", icon: "⚙️", displayName: "MCP工具" },
    { skillName: "tmux", category: "dev", icon: "🧵", displayName: "tmux" },
    { skillName: "terra", category: "dev", icon: "🏗️", displayName: "基础设施" },
    { skillName: "zero-trust-podman", category: "dev", icon: "🐳", displayName: "Podman" },
    { skillName: "skill-creator", category: "dev", icon: "🛠️", displayName: "技能创建" },
    { skillName: "peekaboo", category: "dev", icon: "🖱️", displayName: "UI自动化" },
    // 通讯 (6)
    { skillName: "slack", category: "communication", icon: "💬", displayName: "Slack" },
    { skillName: "discord", category: "communication", icon: "🎮", displayName: "Discord" },
    { skillName: "imsg", category: "communication", icon: "💬", displayName: "iMessage" },
    { skillName: "wacli", category: "communication", icon: "📱", displayName: "WhatsApp" },
    { skillName: "bluebubbles", category: "communication", icon: "📱", displayName: "BlueBubbles" },
    { skillName: "voice-call", category: "communication", icon: "📞", displayName: "语音通话" },
    // 媒体 (11)
    { skillName: "sag", category: "media", icon: "🗣️", displayName: "文本转语音" },
    { skillName: "sherpa-onnx-tts", category: "media", icon: "🗣️", displayName: "离线TTS" },
    { skillName: "songsee", category: "media", icon: "🌊", displayName: "音频可视化" },
    { skillName: "video-frames", category: "media", icon: "🎞️", displayName: "视频帧提取" },
    { skillName: "video-gifs", category: "media", icon: "🎬", displayName: "视频转GIF" },
    { skillName: "veo3", category: "media", icon: "🎥", displayName: "AI视频生成" },
    { skillName: "camsnap", category: "media", icon: "📷", displayName: "摄像头截图" },
    { skillName: "yt", category: "media", icon: "📺", displayName: "YouTube" },
    { skillName: "ytdl", category: "media", icon: "📺", displayName: "视频下载" },
    { skillName: "yt-local", category: "media", icon: "📺", displayName: "本地播放" },
    { skillName: "yt-transcript", category: "media", icon: "📺", displayName: "字幕提取" },
    // 工具 (18)
    { skillName: "weather", category: "tools", icon: "🌤️", displayName: "天气查询" },
    { skillName: "goplaces", category: "tools", icon: "📍", displayName: "地点搜索" },
    { skillName: "local-places", category: "tools", icon: "📍", displayName: "本地商家" },
    { skillName: "summarize", category: "tools", icon: "🧾", displayName: "内容摘要" },
    { skillName: "gifgrep", category: "tools", icon: "🔍", displayName: "GIF搜索" },
    { skillName: "openhue", category: "tools", icon: "💡", displayName: "Hue灯光" },
    { skillName: "sonoscli", category: "tools", icon: "🔊", displayName: "Sonos音箱" },
    { skillName: "spotify-player", category: "tools", icon: "🎵", displayName: "Spotify" },
    { skillName: "vlc", category: "tools", icon: "📺", displayName: "VLC播放器" },
    { skillName: "eightctl", category: "tools", icon: "🛏️", displayName: "Eight睡眠" },
    { skillName: "bird", category: "tools", icon: "🐦", displayName: "Twitter/X" },
    { skillName: "ssh-agent", category: "tools", icon: "🔑", displayName: "SSH密钥" },
    { skillName: "warp", category: "tools", icon: "⚡", displayName: "Warp终端" },
    { skillName: "blucli", category: "tools", icon: "🔵", displayName: "蓝牙" },
    { skillName: "blogwatcher", category: "tools", icon: "👀", displayName: "博客监控" },
    { skillName: "food-order", category: "tools", icon: "🍕", displayName: "外卖订购" },
    { skillName: "ordercli", category: "tools", icon: "🍕", displayName: "食物订购" },
    { skillName: "gog", category: "tools", icon: "🎮", displayName: "GOG游戏" },
    { skillName: "zh", category: "tools", icon: "🇨🇳", displayName: "中文处理" },
    { skillName: "zingo", category: "tools", icon: "🎯", displayName: "游戏工具" },
];
// 按技能名称查找分类
export function findSkillCategory(skillName) {
    return SKILL_JOB_CATEGORY_MAPPINGS.find((m) => m.skillName === skillName);
}
// 按职业分类筛选技能
export function filterSkillsByCategory(category) {
    return SKILL_JOB_CATEGORY_MAPPINGS.filter((m) => m.category === category);
}
// 获取职业类别信息
export function getCategoryInfo(category) {
    return JOB_CATEGORIES.find((c) => c.id === category);
}
// 根据职业类别筛选真实技能数据
export function filterRealSkillsByCategory(allSkills, category) {
    const categoryMappings = filterSkillsByCategory(category);
    const results = [];
    for (const skill of allSkills) {
        for (const cm of categoryMappings) {
            if (skill.skillKey === cm.skillName) {
                results.push({
                    skill,
                    mapping: {
                        skillKeyPattern: cm.skillName,
                        displayName: cm.displayName,
                        description: skill.description,
                        category: cm.category,
                        visual: {
                            variant: "secondary",
                            icon: cm.icon || "📦",
                            size: "medium",
                            featured: false,
                        },
                        interaction: {
                            type: "prompt",
                            prompt: `请帮我使用 ${cm.displayName || skill.name} 技能。`,
                        },
                        priority: 50,
                    },
                });
                break;
            }
        }
    }
    return results.sort((a, b) => b.mapping.priority - a.mapping.priority);
}
// 根据多个职业类别筛选技能（交集）
// 找出同时属于所有指定类别的技能
export function filterSkillsByMultipleCategories(allSkills, categories) {
    // 找出同时属于所有指定类别的技能名称
    const categorySkillNames = new Map();
    for (const cat of categories) {
        const mappings = filterSkillsByCategory(cat);
        for (const m of mappings) {
            if (!categorySkillNames.has(m.skillName)) {
                categorySkillNames.set(m.skillName, new Set());
            }
            categorySkillNames.get(m.skillName).add(cat);
        }
    }
    // 筛选出属于所有指定类别的技能
    const targetSkillNames = Array.from(categorySkillNames.entries())
        .filter(([_, cats]) => cats.size === categories.length)
        .map(([name]) => name);
    const results = [];
    for (const skill of allSkills) {
        if (targetSkillNames.includes(skill.skillKey)) {
            const mapping = findSkillCategory(skill.skillKey);
            if (mapping) {
                results.push({
                    skill,
                    mapping: {
                        skillKeyPattern: mapping.skillName,
                        displayName: mapping.displayName,
                        description: skill.description,
                        category: categories[0], // 使用第一个类别作为主类别
                        visual: {
                            variant: "secondary",
                            icon: mapping.icon || "📦",
                            size: "medium",
                            featured: false,
                        },
                        interaction: {
                            type: "prompt",
                            prompt: `请帮我使用 ${mapping.displayName || skill.name} 技能。`,
                        },
                        priority: 50,
                    },
                });
            }
        }
    }
    return results.sort((a, b) => b.mapping.priority - a.mapping.priority);
}
