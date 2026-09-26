import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

KEY_FILE = r"C:\Users\sammy\prompt-builder\play-service-account.json"
PACKAGE_NAME = "app.vercel.snapchef_ai.twa"
AAB_PATH = r"C:\Users\sammy\Downloads\snapchef-ai-v1.0.1.aab"
ICON_PATH = r"C:\Users\sammy\snapchef-ai\public\play-icon-512.png"
FEATURE_PATH = r"C:\Users\sammy\snapchef-ai\public\play-feature-1024x500.png"
SCOPES = ['https://www.googleapis.com/auth/androidpublisher']

SHORT_DESC = "Snap your fridge, get an AI recipe, cook a 15-min meal."
assert len(SHORT_DESC) <= 80, f"Short description too long: {len(SHORT_DESC)}"

FULL_DESC = """SnapChef AI turns the ingredients you already have into a real recipe in seconds. Snap a photo of your fridge or pantry, and AI camera vision detects what's fresh and ready to cook.

WHAT MAKES SNAPCHEF DIFFERENT:
- AI Fridge Scanner: Point your camera at your fridge, pantry, or countertop and get a list of usable ingredients instantly.
- Custom AI Recipes: Get a full recipe built specifically from what you have on hand, with prep time, cook time, and step-by-step instructions.
- Hands-Free Cook Mode: Full-screen, step-by-step cooking view that keeps your screen awake, with automatic timers and audio alerts for each step.
- Serving Size Scaler: Instantly rescale any recipe's ingredient amounts for 1 to 4+ servings, including fractions and mixed numbers.
- Nutrition at a Glance: See estimated calories, protein, carbs, and fat for every recipe, scaled to your serving size.
- 110+ Recipe Library: Browse a full built-in collection any time you don't want to scan.

No more wasted groceries. No more "what's for dinner." Just point, snap, and cook."""
assert len(FULL_DESC) <= 4000, f"Full description too long: {len(FULL_DESC)}"

RELEASE_NOTES = "Initial launch of SnapChef AI: AI fridge scanning, custom recipe generation, hands-free cook mode, serving scaler, and nutrition estimates."
assert len(RELEASE_NOTES) <= 500, f"Release notes too long: {len(RELEASE_NOTES)}"


def main():
    print("=" * 60)
    print(" SnapChef AI Google Play Publisher")
    print("=" * 60)

    if not os.path.exists(KEY_FILE):
        print(f"ERROR: Key file not found: {KEY_FILE}")
        sys.exit(1)
    if not os.path.exists(AAB_PATH):
        print(f"ERROR: AAB not found: {AAB_PATH}")
        sys.exit(1)

    creds = service_account.Credentials.from_service_account_file(KEY_FILE, scopes=SCOPES)
    service = build('androidpublisher', 'v3', credentials=creds)

    print(f"Checking package '{PACKAGE_NAME}' on Google Play Console...")
    try:
        edit = service.edits().insert(packageName=PACKAGE_NAME, body={}).execute()
        edit_id = edit['id']
        print(f"[OK] Found package '{PACKAGE_NAME}'. Edit session: {edit_id}")
    except Exception as e:
        err_str = str(e)
        if "Package not found" in err_str:
            print("Package not created yet in Play Console. Click 'Create app' first.")
            return False
        print("Error connecting to Play API:", e)
        return False

    try:
        print(f"\n1. Uploading Android App Bundle: {AAB_PATH}...")
        media = MediaFileUpload(AAB_PATH, mimetype='application/octet-stream', resumable=True)
        bundle_resp = service.edits().bundles().upload(
            packageName=PACKAGE_NAME, editId=edit_id, media_body=media
        ).execute()
        version_code = bundle_resp.get('versionCode')
        print(f"Uploaded bundle with versionCode: {version_code}")

        print("\n2. Updating Store Listing (en-US)...")
        service.edits().listings().update(
            packageName=PACKAGE_NAME, editId=edit_id, language="en-US",
            body={
                "language": "en-US",
                "title": "SnapChef AI - Fridge Scanner",
                "shortDescription": SHORT_DESC,
                "fullDescription": FULL_DESC
            }
        ).execute()
        print("Store listing updated.")

        if os.path.exists(ICON_PATH):
            print(f"\n3. Uploading App Icon: {ICON_PATH}...")
            service.edits().images().upload(
                packageName=PACKAGE_NAME, editId=edit_id, language="en-US",
                imageType="icon", media_body=MediaFileUpload(ICON_PATH, mimetype='image/png')
            ).execute()
            print("Icon uploaded.")
        else:
            print(f"\n3. SKIPPED - icon not found at {ICON_PATH}")

        if os.path.exists(FEATURE_PATH):
            print(f"\n4. Uploading Feature Graphic: {FEATURE_PATH}...")
            service.edits().images().upload(
                packageName=PACKAGE_NAME, editId=edit_id, language="en-US",
                imageType="featureGraphic", media_body=MediaFileUpload(FEATURE_PATH, mimetype='image/png')
            ).execute()
            print("Feature graphic uploaded.")
        else:
            print(f"\n4. SKIPPED - feature graphic not found at {FEATURE_PATH}")

        print(f"\n5. Assigning bundle {version_code} to Production Track (as draft)...")
        track_body = {
            "track": "production",
            "releases": [{
                "name": f"1.0.0 ({version_code})",
                "versionCodes": [str(version_code)],
                "status": "draft",
                "releaseNotes": [{"language": "en-US", "text": RELEASE_NOTES}]
            }]
        }
        service.edits().tracks().update(
            packageName=PACKAGE_NAME, editId=edit_id, track="production", body=track_body
        ).execute()
        print("Production track configured (draft - not public).")

        print("\n6. Committing edit session...")
        commit_res = service.edits().commit(packageName=PACKAGE_NAME, editId=edit_id).execute()
        print("\n" + "=" * 60)
        print("SUCCESS. SnapChef AI listing is set up as a draft in Play Console.")
        print("Commit:", commit_res)
        print("=" * 60)
        return True

    except Exception as err:
        print("\nError during publication:", err)
        try:
            service.edits().delete(packageName=PACKAGE_NAME, editId=edit_id).execute()
            print("Edit session deleted.")
        except Exception:
            pass
        return False


if __name__ == "__main__":
    main()
