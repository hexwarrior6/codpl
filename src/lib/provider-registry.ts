import {
  ALIBABA_CLOUD_ICON,
  BAIDU_CLOUD_ICON,
  CLAUDE_ICON,
  DEEPSEEK_ICON,
  DOUBAO_ICON,
  GEMINI_ICON,
  KIMI_ICON,
  MIMO_BRAND_ICON,
  MINIMAX_ICON,
  OLLAMA_CLOUD_ICON,
  OPENAI_ICON,
  OPENCODE_BRAND_ICON,
  LOBE_ICON_KWAI_KAT,
  LOBE_ICON_STREAMLAKE,
  QWEN_ICON,
  SILICON_CLOUD_ICON,
  STEPFUN_ICON,
  TENCENT_CLOUD_ICON,
  VOLCENGINE_ICON,
  ZHIPU_ICON,
  ALAYA_CODE_ICON,
  INFINIGENCE_ICON,
} from './brand-icons';

export interface AccessLinks {
  affiliate?: { url: string; label: string; note?: string } | null;
  officialPurchase?: { url: string; label: string } | null;
  docs?: { url: string; label: string } | null;
}

interface AliasEntry {
  match: string[];
  value: string;
}

interface ResourceLinkEntry {
  match: string[];
  url: string;
}

interface AccessCatalogEntry extends AccessLinks {
  match: string[];
}

export const providerAliases: AliasEntry[] = [
  { match: ['百炼', '阿里', 'qwen'], value: 'alibabacloud' },
  { match: ['百度', '千帆', 'qianfan'], value: 'baidu' },
  { match: ['京东', 'jdcloud', '京东云'], value: 'openai' },
  { match: ['讯飞', 'astron', 'spark'], value: 'spark' },
  { match: ['kimi', '月之暗面', 'moonshot'], value: 'moonshot' },
  { match: ['阶跃', 'step'], value: 'openai' },
  { match: ['minimax'], value: 'minimax' },
  { match: ['火山', 'volc', 'ark', 'doubao', '字节'], value: 'bytedance' },
  { match: ['智谱', 'glm', 'zhipu'], value: 'zhipu' },
  { match: ['硅基', 'silicon'], value: 'openai' },
  { match: ['腾讯', 'hunyuan', 'lkeap'], value: 'tencent' },
  { match: ['天翼', 'ctyun'], value: 'openai' },
  { match: ['无问', 'infini'], value: 'openai' },
  { match: ['优云', 'modelverse'], value: 'openai' },
  { match: ['快手', 'streamlake', '万擎', 'kat-coder'], value: 'anthropic' },
  { match: ['ollama'], value: 'ollama' },
  { match: ['移动云', 'cmecloud'], value: 'openai' },
  { match: ['联通元景', '元景', 'ai-yuanjing', 'yuanjing'], value: 'openai' },
  { match: ['联通云', 'cucloud'], value: 'openai' },
  { match: ['anthropic', 'claude'], value: 'anthropic' },
  { match: ['openai', 'gpt'], value: 'openai' },
];

export const providerResourceLinks: ResourceLinkEntry[] = [
  { match: ['讯飞'], url: 'https://maas.xfyun.cn/packageSubscription?inviteCode=MAAS-9C222A26' },
  { match: ['百炼', '阿里'], url: 'https://www.aliyun.com/benefit/ai/aistar?userCode=c4jen4cr&clubBiz=subTask..12421197..10263..' },
  { match: ['京东', 'jdcloud', '京东云'], url: 'https://3.cn/2J-iqCzC' },
  { match: ['kimi', '月之暗面'], url: 'https://www.kimi.com/code' },
  { match: ['小米', 'xiaomi', 'mimo', 'xiaomimimo'], url: 'https://platform.xiaomimimo.com/#/docs/news/token-plan-release' },
  { match: ['阶跃', 'step'], url: 'https://platform.stepfun.com/' },
  { match: ['无问', 'infini'], url: 'https://cloud.infini-ai.com/login?redirect=/genstudio/invitation&invite_code=8ikcCWUF' },
  { match: ['minimax'], url: 'https://platform.minimaxi.com/subscribe/coding-plan?code=KBIleV2vzm&source=link' },
  { match: ['火山', 'volc'], url: 'https://volcengine.com/L/T4lDlYTm4fI/' },
  { match: ['智谱', 'zhipu'], url: 'https://www.bigmodel.cn/glm-coding?ic=SBANWTTFUA' },
  { match: ['腾讯'], url: 'https://curl.qcloud.com/SOnqJUPT' },
  { match: ['优云', 'modelverse'], url: 'https://passport.compshare.cn/register?referral_code=3z65GjelIQiFwPCZN3CL1i' },
  { match: ['快手', 'streamlake', '万擎'], url: 'https://www.streamlake.com/document' },
  { match: ['opencode', 'zen go'], url: 'https://opencode.ai/docs/zh-cn/go' },
  { match: ['ollama'], url: 'https://ollama.com/' },
  { match: ['联通元景', '元景', 'ai-yuanjing', 'yuanjing'], url: 'https://maas.ai-yuanjing.com/aibase/home' },
  { match: ['联通云', 'cucloud'], url: 'https://support.cucloud.cn/document/127/591/2357.html?id=2357&arcid=7015' },
  { match: ['移动云', 'cmecloud'], url: 'https://ecloud.10086.cn/portal/act/codingplan' },
  { match: ['百度', '千帆', 'qianfan'], url: 'https://console.bce.baidu.com/qianfan/resource/subscribe' },
];

export const providerAccessCatalog: AccessCatalogEntry[] = [
  {
    match: ['讯飞', 'astron'],
    affiliate: {
      url: 'https://maas.xfyun.cn/packageSubscription?inviteCode=MAAS-9C222A26',
      label: 'AFF 优惠购买',
      note: '通过邀请链接下单，购买者可能享优惠，我方可能获得返利。',
    },
    officialPurchase: { url: 'https://maas.xfyun.cn/packageSubscription', label: '官方购买' },
    docs: { url: 'https://www.xfyun.cn/doc/spark/CodingPlan.html', label: '官方文档' },
  },
  {
    match: ['百炼', '阿里', 'dashscope'],
    affiliate: {
      url: 'https://www.aliyun.com/benefit/ai/aistar?userCode=c4jen4cr&clubBiz=subTask..12421197..10263..',
      label: 'AFF 优惠购买',
      note: '通过专属活动页进入，购买者可能享优惠，我方可能获得返利。',
    },
    officialPurchase: { url: 'https://bailian.console.aliyun.com/', label: '官方购买' },
    docs: { url: 'https://help.aliyun.com/zh/model-studio/coding-plan', label: '官方文档' },
  },
  {
    match: ['kimi', '月之暗面', 'moonshot'],
    officialPurchase: { url: 'https://www.kimi.com/code/zh', label: '官方购买' },
    docs: { url: 'https://www.kimi.com/coding/docs/', label: '官方文档' },
  },
  {
    match: ['minimax'],
    affiliate: {
      url: 'https://platform.minimaxi.com/subscribe/coding-plan?code=KBIleV2vzm&source=link',
      label: 'AFF 优惠购买',
      note: '通过推荐链接下单，购买者可能享优惠，我方可能获得返利。',
    },
    officialPurchase: { url: 'https://platform.minimaxi.com/subscribe/coding-plan', label: '官方购买' },
    docs: { url: 'https://platform.minimaxi.com/docs/coding-plan/intro', label: '官方文档' },
  },
  {
    match: ['阶跃', 'stepfun', 'step'],
    officialPurchase: { url: 'https://platform.stepfun.com/', label: '官方购买' },
    docs: { url: 'https://platform.stepfun.com/docs/zh/stepplan/overview', label: '官方文档' },
  },
  {
    match: ['火山', 'volc', '方舟'],
    affiliate: {
      url: 'https://volcengine.com/L/T4lDlYTm4fI/',
      label: 'AFF 优惠购买',
      note: '通过活动短链进入，购买者可能享优惠，我方可能获得返利。',
    },
    officialPurchase: { url: 'https://www.volcengine.com/activity/codingplan', label: '官方购买' },
    docs: { url: 'https://www.volcengine.com/docs/82379/1925114?lang=zh', label: '官方文档' },
  },
  {
    match: ['智谱', 'zhipu', 'glm'],
    affiliate: {
      url: 'https://www.bigmodel.cn/glm-coding?ic=SBANWTTFUA',
      label: 'AFF 优惠购买',
      note: '通过邀请页进入，购买者可能享优惠，我方可能获得返利。',
    },
    officialPurchase: { url: 'https://www.bigmodel.cn/glm-coding', label: '官方购买' },
    docs: { url: 'https://docs.bigmodel.cn/cn/coding-plan/overview', label: '官方文档' },
  },
  {
    match: ['无问', 'infini'],
    affiliate: {
      url: 'https://cloud.infini-ai.com/login?redirect=/genstudio/invitation&invite_code=8ikcCWUF',
      label: 'AFF 优惠购买',
      note: '通过邀请页进入，购买者可能享优惠，我方可能获得返利。',
    },
    officialPurchase: { url: 'https://cloud.infini-ai.com/', label: '官方购买' },
    docs: { url: 'https://docs.infini-ai.com/ai-coder/', label: '官方文档' },
  },
  {
    match: ['腾讯', 'lkeap', 'hunyuan'],
    affiliate: {
      url: 'https://curl.qcloud.com/SOnqJUPT',
      label: 'AFF 优惠购买',
      note: '通过专属短链进入，购买者可能享优惠，我方可能获得返利。',
    },
    officialPurchase: { url: 'https://cloud.tencent.com/act/pro/codingplan', label: '官方购买' },
    docs: { url: 'https://cloud.tencent.com/document/product/1772/128953', label: '官方文档' },
  },
  {
    match: ['京东', 'jdcloud', '京东云'],
    affiliate: {
      url: 'https://3.cn/2J-iqCzC',
      label: 'AFF 优惠购买',
      note: '通过专属短链进入，购买者可能享优惠，我方可能获得返利。',
    },
    officialPurchase: { url: 'https://www.jdcloud.com/cn/pages/codingplan', label: '官方购买' },
    docs: { url: 'https://docs.jdcloud.com/cn/jdaip/claudecode', label: '官方文档' },
  },
  {
    match: ['优云', 'modelverse', 'compshare'],
    affiliate: {
      url: 'https://passport.compshare.cn/register?referral_code=3z65GjelIQiFwPCZN3CL1i',
      label: 'AFF 优惠购买',
      note: '通过推荐注册链接进入，购买者可能享优惠，我方可能获得返利。',
    },
    officialPurchase: { url: 'https://www.compshare.cn/', label: '官方购买' },
    docs: { url: 'https://www.compshare.cn/docs/modelverse/introduce/modelapi', label: '官方文档' },
  },
  {
    match: ['快手', 'streamlake', '万擎', 'kat-coder'],
    docs: { url: 'https://www.streamlake.com/document', label: '官方文档' },
  },
  {
    match: ['opencode', 'zen go'],
    officialPurchase: { url: 'https://opencode.ai/', label: '官网' },
    docs: { url: 'https://opencode.ai/docs/zh-cn/go', label: '官方文档' },
  },
  {
    match: ['ollama'],
    officialPurchase: { url: 'https://ollama.com/', label: '官网' },
    docs: { url: 'https://docs.ollama.com/api/openai-compatibility', label: 'OpenAI 兼容文档' },
  },
  {
    match: ['联通云', 'cucloud'],
    docs: { url: 'https://support.cucloud.cn/document/127/591/2357.html?id=2357&arcid=7015', label: '官方文档' },
  },
  {
    match: ['联通元景', '元景', 'yuanjing'],
    officialPurchase: { url: 'https://maas.ai-yuanjing.com/aibase/home', label: '官方购买' },
  },
  {
    match: ['移动云', 'cmecloud'],
    officialPurchase: { url: 'https://ecloud.10086.cn/portal/act/codingplan', label: '官方购买' },
  },
  {
    match: ['百度', '千帆', 'qianfan'],
    officialPurchase: { url: 'https://cloud.baidu.com/product/codingplan.html', label: '官方购买' },
    docs: { url: 'https://cloud.baidu.com/doc/qianfan/s/imlg0beiu', label: '官方文档' },
  },
  {
    match: ['小米', 'mimo', 'xiaomi'],
    officialPurchase: { url: 'https://platform.xiaomimimo.com/', label: '官方购买' },
    docs: { url: 'https://platform.xiaomimimo.com/#/docs/news/token-plan-release', label: '官方文档' },
  },
  {
    match: ['天翼', 'ctyun'],
    docs: { url: 'https://www.ctyun.cn/document/11061839/11092440', label: '官方文档' },
  },
];

export function resolveProviderKey(providerName = '', modelName = ''): string {
  const combined = `${providerName} ${modelName}`.toLowerCase();
  const matched = providerAliases.find((item) =>
    item.match.some((keyword) => combined.includes(keyword)),
  );
  return matched ? matched.value : 'openai';
}

export function resolveProviderResourceUrl(providerName = ''): string {
  const normalized = providerName.toLowerCase();
  const matched = providerResourceLinks.find((item) =>
    item.match.some((keyword) => normalized.includes(keyword)),
  );
  return matched?.url || '';
}

export function resolveProviderAccessLinks(providerName = ''): AccessLinks {
  const normalized = providerName.toLowerCase();
  const matched = providerAccessCatalog.find((item) =>
    item.match.some((keyword) => normalized.includes(keyword)),
  );
  return matched ?? { affiliate: null, officialPurchase: null, docs: null };
}

export function resolveProviderHotlink(provider: string, model = ''): string {
  const key = resolveProviderKey(provider, model);
  switch (key) {
    case 'alibabacloud':
      return ALIBABA_CLOUD_ICON;
    case 'baidu':
      return BAIDU_CLOUD_ICON;
    case 'bytedance':
      return VOLCENGINE_ICON;
    case 'moonshot':
      return KIMI_ICON;
    case 'minimax':
      return MINIMAX_ICON;
    case 'spark':
      return 'https://maas.xfyun.cn/spark-icon.ico';
    case 'tencent':
      return TENCENT_CLOUD_ICON;
    case 'zhipu':
      return ZHIPU_ICON;
    case 'anthropic':
      return CLAUDE_ICON;
    case 'ollama':
      return OLLAMA_CLOUD_ICON;
    case 'openai':
      return OPENAI_ICON;
    default:
      return '';
  }
}

interface BrandMatch {
  keywords: string[];
  icon: string;
  alt: string;
}

const providerBrandMatchers: BrandMatch[] = [
  { keywords: ['小米', 'xiaomi', 'mimo'], icon: MIMO_BRAND_ICON, alt: '小米 MiMo' },
  { keywords: ['快手', 'streamlake', '万擎'], icon: LOBE_ICON_STREAMLAKE, alt: '快手 StreamLake' },
  { keywords: ['alaya'], icon: ALAYA_CODE_ICON, alt: 'Alaya Code' },
  { keywords: ['opencode', 'zen go'], icon: OPENCODE_BRAND_ICON, alt: 'OpenCode Go' },
  { keywords: ['ollama'], icon: OLLAMA_CLOUD_ICON, alt: 'Ollama Cloud' },
  { keywords: ['京东', 'jdcloud'], icon: 'https://img1.jcloudcs.com/portal/favicon.ico', alt: '京东云' },
  { keywords: ['优云', 'modelverse', 'compshare'], icon: 'https://www.compshare.cn/favicon.ico', alt: '优云' },
  { keywords: ['百度', '千帆', 'qianfan'], icon: BAIDU_CLOUD_ICON, alt: '百度云' },
  { keywords: ['硅基', 'silicon'], icon: SILICON_CLOUD_ICON, alt: '硅基流动' },
  { keywords: ['联通元景', '元景', 'ai-yuanjing', 'yuanjing'], icon: 'https://maas.ai-yuanjing.com/favicon.ico', alt: '联通元景' },
  { keywords: ['移动云', 'cmecloud'], icon: 'https://ecloud.eos-guangzhou-1.cmecloud.cn/fe/favicon.ico', alt: '移动云' },
  { keywords: ['联通云', 'cucloud'], icon: 'https://www.cucloud.cn/templets/1/default/images/logo_menhu.ico', alt: '联通云' },
  { keywords: ['天翼', 'ctyun'], icon: 'https://www.ctyun.cn/favicon.ico', alt: '天翼云' },
  { keywords: ['火山', 'volc'], icon: VOLCENGINE_ICON, alt: '火山引擎' },
  { keywords: ['腾讯'], icon: TENCENT_CLOUD_ICON, alt: '腾讯云' },
  { keywords: ['百炼', '阿里'], icon: ALIBABA_CLOUD_ICON, alt: '阿里云百炼' },
  { keywords: ['阶跃', 'step'], icon: STEPFUN_ICON, alt: '阶跃 StepFun' },
  { keywords: ['讯飞', 'astron'], icon: 'https://maas.xfyun.cn/spark-icon.ico', alt: '讯飞星辰' },
  { keywords: ['无问', 'infini'], icon: INFINIGENCE_ICON, alt: '无问芯穹' },
  { keywords: ['智谱', 'zhipu'], icon: ZHIPU_ICON, alt: '智谱' },
];

export function resolveProviderBrand(provider: string, model = ''): { icon: string; alt: string } {
  const target = `${provider}`.toLowerCase();
  const matched = providerBrandMatchers.find((m) => m.keywords.some((k) => target.includes(k)));
  if (matched) return { icon: matched.icon, alt: matched.alt };
  const hotlink = resolveProviderHotlink(provider, model);
  return { icon: hotlink, alt: provider || model || 'Provider' };
}

const modelBrandMatchers: BrandMatch[] = [
  { keywords: ['mimo-v2-pro', 'mimo-v2-omni'], icon: MIMO_BRAND_ICON, alt: 'MiMo' },
  { keywords: ['kat-coder', 'kwaikat', '快手'], icon: LOBE_ICON_KWAI_KAT, alt: 'KAT-Coder' },
  { keywords: ['ark', 'doubao', '火山'], icon: DOUBAO_ICON, alt: '豆包' },
  { keywords: ['qwen'], icon: QWEN_ICON, alt: 'Qwen' },
  { keywords: ['glm', 'zhipu'], icon: ZHIPU_ICON, alt: 'GLM' },
  { keywords: ['step', '阶跃'], icon: STEPFUN_ICON, alt: 'StepFun' },
  { keywords: ['deepseek'], icon: DEEPSEEK_ICON, alt: 'DeepSeek' },
  { keywords: ['kimi'], icon: KIMI_ICON, alt: 'Kimi' },
  { keywords: ['minimax'], icon: MINIMAX_ICON, alt: 'MiniMax' },
  { keywords: ['claude', 'anthropic'], icon: CLAUDE_ICON, alt: 'Claude' },
  { keywords: ['gpt', 'openai'], icon: OPENAI_ICON, alt: 'OpenAI' },
  { keywords: ['gemini'], icon: GEMINI_ICON, alt: 'Gemini' },
];

export function resolveModelBrand(provider: string, model = ''): { icon: string; alt: string } {
  const combined = `${provider} ${model}`.toLowerCase();
  const matched = modelBrandMatchers.find((m) => m.keywords.some((k) => combined.includes(k)));
  if (matched) return { icon: matched.icon, alt: matched.alt };
  return { icon: resolveProviderHotlink(provider, model), alt: model || provider || 'Model' };
}

export async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}
