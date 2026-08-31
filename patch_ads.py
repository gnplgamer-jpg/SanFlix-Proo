import re

with open('src/components/SpinnerPage.tsx', 'r') as f:
    content = f.read()

# Replace handleClaimCheckIn
content = re.sub(
    r'if \(Capacitor\.isNativePlatform\(\)\) \{\s*try \{\s*setSpinning\(true\);\s*await AdMob\.prepareRewardVideoAd\(\{.*?\n\s*\}\);\s*AdMob\.addListener.*?triggerUnityAd\(\'checkin\'\);\s*\}\)\;\s*await AdMob\.showRewardVideoAd\(\);\s*\} catch \(error\) \{\s*console\.error\("AdMob Error", error\);\s*triggerUnityAd\(\'checkin\'\);\s*\}\s*\} else \{',
    """if (Capacitor.isNativePlatform()) {
      triggerUnityAd('checkin');
    } else {""",
    content,
    flags=re.DOTALL
)

# Replace handleTrailerMission
content = re.sub(
    r'if \(Capacitor\.isNativePlatform\(\)\) \{\s*try \{\s*setSpinning\(true\);\s*await AdMob\.prepareRewardVideoAd\(\{.*?\n\s*\}\);\s*AdMob\.addListener.*?triggerUnityAd\(\'mission\'\);\s*\}\)\;\s*await AdMob\.showRewardVideoAd\(\);\s*\} catch \(error\) \{\s*console\.error\("AdMob Error", error\);\s*triggerUnityAd\(\'mission\'\);\s*\}\s*\} else \{',
    """if (Capacitor.isNativePlatform()) {
      triggerUnityAd('mission');
    } else {""",
    content,
    flags=re.DOTALL
)

# Replace spin logic
content = re.sub(
    r'if \(Capacitor\.isNativePlatform\(\)\) \{\s*try \{\s*await AdMob\.prepareRewardVideoAd\(\{.*?\n\s*\}\);\s*AdMob\.addListener.*?triggerUnityAd\(\);\s*\}\)\;\s*await AdMob\.showRewardVideoAd\(\);\s*\} catch \(error\) \{\s*console\.error\("AdMob Error", error\);\s*triggerUnityAd\(\);\s*// Fallback\s*\}\s*\} else \{',
    """if (Capacitor.isNativePlatform()) {
      triggerUnityAd();
    } else {""",
    content,
    flags=re.DOTALL
)

with open('src/components/SpinnerPage.tsx', 'w') as f:
    f.write(content)

print("Patch applied via python")
