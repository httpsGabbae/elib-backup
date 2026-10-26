# LCC Library Gateway

The main folder contains the completed website, integrated from the edited version in `fixed/`. It uses these existing runtime files:

```text
index.html
style.css
script.js
images/
```

Open `index.html` or serve this folder with a static web server. No build step or backend is required. The original layout, resource modals, hero slideshow, staff carousel, FAQ, gallery descriptions, and Google Drive tour embed are retained.

## Gallery navigation

The full gallery is a separate view in the same HTML document, opened at `index.html#gallery-page`. Home, Resources, Staff, Back to home, browser Back/Forward, and direct gallery links work without a second HTML file. The homepage keeps its gallery preview.

## Editing content

- `index.html`: page sections, the homepage gallery preview, the full gallery view, FAQ, and footer.
- `style.css`: the original styles in their original cascade order, separated by source comments.
- `script.js`: resource settings and public access information, staff records, and existing interactions, separated by source comments.
- `images/`: all logos, slideshow images, staff portraits, and gallery photos. The current library photos begin with `library-`, and portraits begin with `staff-`.

Replace images directly and edit each image's alt text and caption in `index.html` or the staff records in `script.js`. The gallery uses static HTML; adding or replacing photos does not require JavaScript.

## Access information

The portal remains public. Shared account details in `script.js` are downloadable by every visitor even when masked in the interface. The LIBROS School ID field shows the `25-0000` placeholder only and does not collect or save a school number.

## Repository files

Git metadata, local skills, documentation, and existing backup/video files are development material, not runtime requirements. Deploy only `index.html`, `style.css`, `script.js`, and `images/`. The original large MP4 remains ignored by Git; playback still uses the existing Google Drive embed.

## Shared Drive photos

The gallery contains eight distinct library views with captions matched to the photos. Four of these also appear in the homepage preview. Similar views of the same shelves and reading area were removed from the gallery to reduce repetition; unused image files are retained for future editing. Images are stored locally, so the site does not depend on Drive image hotlinks.

All eight staff portraits were downloaded from the named files in the supplied Drive folder and matched to their staff records. The Student Assistants folder contains a name list but no portraits, so those records retain initials.

The `fixed/` folder is retained as the previous working copy. Open or deploy the root `index.html` to use the integrated main site.
