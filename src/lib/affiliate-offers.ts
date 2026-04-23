export interface AffiliateOffer {
  key: string;
  provider: string;
  model: string;
  headline: string;
  accent: string;
  description: string;
  reward: string;
  note?: string;
  url: string;
  actionLabel: string;
}

export const affiliateOffers: AffiliateOffer[] = [
  {
    key: 'xfyun',
    provider: '讯飞星辰',
    model: 'glm-5',
    headline: '讯飞星辰专属邀请入口',
    accent: '邀请码下单',
    description: '通过专属邀请页进入讯飞星辰购买页，可直接带上邀请参数完成订阅开通。',
    reward: '邀请码 MAAS-9C222A26',
    note: '官方邀请页链接已核通，点击即可直达购买页。',
    url: 'https://maas.xfyun.cn/packageSubscription?inviteCode=MAAS-9C222A26',
    actionLabel: '前往购买',
  },
  {
    key: 'jdcloud',
    provider: '京东云',
    model: 'DeepSeek-V3.2',
    headline: '京东云 Coding 购买入口',
    accent: '5 模型直达',
    description: '当前按确认的 5 个模型接入：DeepSeek-V3.2、GLM-5、GLM-4.7、MiniMax-M2.5、Kimi-K2.5，适合直接开通后参与测速对比。',
    reward: '京东云官方购买链接',
    url: 'https://3.cn/2J-iqCzC',
    actionLabel: '立即购买',
  },
  {
    key: 'volcengine',
    provider: '火山引擎',
    model: 'deepseek-v3.2',
    headline: '方舟 Coding Plan 订阅',
    accent: '6 模型接入',
    description: '火山引擎 Coding Plan 展示 minimax-m2.5、glm-4.7、glm-5.1、deepseek-v3.2、kimi-k2.5、kimi-k2.6。',
    reward: '低至 8.9 元',
    url: 'https://volcengine.com/L/T4lDlYTm4fI/',
    actionLabel: '立即订阅',
  },
  {
    key: 'zhipu',
    provider: '智谱',
    model: 'glm-5.1',
    headline: '智谱 GLM Coding 拼好模',
    accent: '好友新购减 10%',
    description: 'GLM Coding 当前已补充展示 glm-5.1；邀请链接可直达官方活动页，适合直接参与拼好模。',
    reward: '好友新购下单立减 10%',
    note: '官方活动规则当前写明：受邀用户首次成功付费订阅 GLM Coding 可享订单金额 10% 立减。',
    url: 'https://www.bigmodel.cn/glm-coding?ic=SBANWTTFUA',
    actionLabel: '立即开拼',
  },
  {
    key: 'wuwen',
    provider: '无问芯穹',
    model: 'deepseek-v3.2',
    headline: '无问芯穹邀请有礼',
    accent: '双重福利',
    description: '邀请链接已切到官方邀请页，注册成功后邀请者和受邀好友都可获得大模型服务平台专属代金券。',
    reward: '邀请码 8ikcCWUF',
    note: '支持 deepseek-v3.2/glm-4.7/minimax-m2.1/minimax-m2.5/minimax-m2.7/glm-5/kimi-k2.5 等模型。',
    url: 'https://cloud.infini-ai.com/login?redirect=/genstudio/invitation&invite_code=8ikcCWUF',
    actionLabel: '前往邀请页',
  },
  {
    key: 'compshare',
    provider: '优云',
    model: 'modelverse',
    headline: '优云推荐注册',
    accent: '专属入口',
    description: '可直接通过这条专属推荐链接进入优云官方注册页，注册后最低 1.9 元即可试订阅套餐。',
    reward: '优云推荐注册链接',
    url: 'https://passport.compshare.cn/register?referral_code=3z65GjelIQiFwPCZN3CL1i',
    actionLabel: '前往注册',
  },
  {
    key: 'siliconflow',
    provider: '硅基流动',
    model: 'deepseek',
    headline: '实名注册返券',
    accent: '每邀 1 人得 1 张',
    description: '被邀请人完成注册并实名认证后，可获得面值 16 元的推荐官奖励券，邀请越多返券越多。',
    reward: '16 元奖励券',
    url: 'https://cloud.siliconflow.cn/i/Zt5ZELMQ',
    actionLabel: '前往注册',
  },
];

export const affiliatePromo = {
  title: '🎁 MiniMax 跨年福利来袭！邀好友享 Coding Plan 双重好礼，助力开发体验！',
  description: '好友立享 9 折专属优惠 + Builder 权益，你赢返利 + 社区特权！',
  url: 'https://platform.minimaxi.com/subscribe/coding-plan?code=KBIleV2vzm&source=link',
};
