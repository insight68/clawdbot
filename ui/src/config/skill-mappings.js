/**
 * Skills 到界面展现的映射表
 *
 * 用于将后端 OpenClaw Skills 映射到前端展示的分类、样式和交互行为
 */
// Marketing 相关 Skills 映射表
export const MARKETING_SKILL_MAPPINGS = [
    // === 快捷操作（Featured Skills）===
    {
        skillKeyPattern: "marketing-campaign",
        displayName: "创建营销活动",
        description: "规划新的营销活动和推广策略",
        category: "campaign",
        visual: {
            variant: "primary",
            icon: "megaphone",
            size: "large",
            featured: true,
        },
        interaction: {
            type: "prompt",
            prompt: "请帮我创建一个营销活动策划，包括目标受众、渠道策略、预算分配和KPI指标。",
        },
        priority: 100,
    },
    {
        skillKeyPattern: "marketing-content",
        displayName: "生成营销内容",
        description: "创建广告文案、社交媒体帖子等",
        category: "content",
        visual: {
            variant: "primary",
            icon: "sparkles",
            size: "large",
            featured: true,
        },
        interaction: {
            type: "prompt",
            prompt: "请帮我生成营销内容，包括广告文案和社交媒体帖子。",
        },
        priority: 90,
    },
    {
        skillKeyPattern: "marketing-analyze",
        displayName: "分析营销数据",
        description: "分析营销效果和ROI",
        category: "analyze",
        visual: {
            variant: "primary",
            icon: "barChart",
            size: "large",
            featured: true,
        },
        interaction: {
            type: "prompt",
            prompt: "请帮我分析营销数据，提供效果评估和优化建议。",
        },
        priority: 80,
    },
    {
        skillKeyPattern: "marketing-optimize",
        displayName: "优化投放策略",
        description: "优化广告投放和受众定位",
        category: "optimize",
        visual: {
            variant: "primary",
            icon: "target",
            size: "large",
            featured: true,
        },
        interaction: {
            type: "prompt",
            prompt: "请帮我优化广告投放策略，包括受众定位和出价建议。",
        },
        priority: 70,
    },
    // === 内容生成类 Skills ===
    {
        skillKeyPattern: "email-campaign*",
        displayName: "邮件营销",
        description: "创建和管理邮件营销活动",
        category: "content",
        visual: {
            variant: "secondary",
            icon: "mail",
            size: "medium",
            featured: false,
        },
        interaction: {
            type: "prompt",
            prompt: "请帮我设计一封营销邮件，包括主题行、正文和CTA。",
        },
        priority: 60,
    },
    {
        skillKeyPattern: "social-media*",
        displayName: "社交媒体",
        description: "社交媒体内容发布和管理",
        category: "content",
        visual: {
            variant: "secondary",
            icon: "share",
            size: "medium",
            featured: false,
        },
        interaction: {
            type: "prompt",
            prompt: "请帮我创建社交媒体营销内容，包括微博、微信、抖音等多平台适配。",
        },
        priority: 55,
    },
    {
        skillKeyPattern: "ad-copy*",
        displayName: "广告文案",
        description: "生成高转化率的广告文案",
        category: "content",
        visual: {
            variant: "secondary",
            icon: "penTool",
            size: "medium",
            featured: false,
        },
        interaction: {
            type: "prompt",
            prompt: "请帮我撰写高转化率的广告文案，突出产品卖点。",
        },
        priority: 50,
    },
    // === 数据分析类 Skills ===
    {
        skillKeyPattern: "audience*",
        displayName: "受众分析",
        description: "分析目标受众和行为特征",
        category: "analyze",
        visual: {
            variant: "accent",
            icon: "users",
            size: "medium",
            featured: false,
        },
        interaction: {
            type: "prompt",
            prompt: "请帮我分析目标受众画像，包括人口统计、兴趣偏好和消费习惯。",
        },
        priority: 45,
    },
    {
        skillKeyPattern: "roi*",
        displayName: "ROI 分析",
        description: "计算和优化营销投资回报率",
        category: "analyze",
        visual: {
            variant: "accent",
            icon: "trendingUp",
            size: "medium",
            featured: false,
        },
        interaction: {
            type: "prompt",
            prompt: "请帮我计算营销活动的ROI，并提供优化建议。",
        },
        priority: 40,
    },
    // === 自动化工具类 Skills ===
    {
        skillKeyPattern: "ab-test*",
        displayName: "A/B 测试",
        description: "设计和分析 A/B 测试实验",
        category: "automation",
        visual: {
            variant: "subtle",
            icon: "flask",
            size: "small",
            featured: false,
        },
        interaction: {
            type: "prompt",
            prompt: "请帮我设计一个A/B测试方案，包括假设、变量和评估指标。",
        },
        priority: 35,
    },
];
// 通配符匹配函数
export function matchSkillPattern(skillKey, pattern) {
    // 将通配符 * 转换为正则表达式
    const regexPattern = pattern.replace(/\*/g, ".*").replace(/\?/g, ".");
    const regex = new RegExp(`^${regexPattern}$`, "i");
    return regex.test(skillKey);
}
// 根据 skillKey 查找映射配置
export function findSkillMapping(skillKey) {
    return MARKETING_SKILL_MAPPINGS.find((entry) => matchSkillPattern(skillKey, entry.skillKeyPattern));
}
// 筛选出 Marketing 相关的 Skills
export function filterMarketingSkills(allSkills) {
    const results = [];
    for (const skill of allSkills) {
        const mapping = findSkillMapping(skill.skillKey);
        if (mapping) {
            results.push({ skill, mapping });
        }
    }
    // 按 priority 降序排序
    results.sort((a, b) => b.mapping.priority - a.mapping.priority);
    return results;
}
// 按分类组织 Skills
export function groupSkillsByCategory(skillsWithMapping) {
    const groups = {
        campaign: [],
        content: [],
        analyze: [],
        optimize: [],
        automation: [],
        other: [],
    };
    for (const item of skillsWithMapping) {
        const category = item.mapping.category;
        // 验证分类是否有效
        if (!(category in groups)) {
            console.warn(`Unknown skill category: ${category}, using "other"`);
            groups.other ??= [];
            groups.other.push(item);
        }
        else {
            groups[category].push(item);
        }
    }
    // 确保所有分类都有数组（即使是空数组）
    for (const cat of [
        "campaign",
        "content",
        "analyze",
        "optimize",
        "automation",
        "other",
    ]) {
        if (!groups[cat]) {
            groups[cat] = [];
        }
    }
    return groups;
}
