import re

with open('src/components/SpinnerPage.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r'if \(Capacitor\.isNativePlatform\(\)\) \{\s*try \{\s*await AdMob\.prepareRewardVideoAd\(\{.*?\}\);\s*AdMob\.addListener.*?triggerUnityAd\(\);\s*\}\);\s*await AdMob\.showRewardVideoAd\(\);\s*\} catch \(error\) \{\s*console\.error\("AdMob Error", error\);\s*triggerUnityAd\(\);\s*// Fallback\s*\}\s*\} else \{',
    """if (Capacitor.isNativePlatform()) {
      triggerUnityAd('spin');
    } else {""",
    content,
    flags=re.DOTALL
)

with open('src/components/SpinnerPage.tsx', 'w') as f:
    f.write(content)

print("Spin patched")
