# LCC eLibrary resource portal

Open `index.html` in a browser or serve this folder with any static web server. No build tools or dependencies are required. The design uses only HTML, CSS, and vanilla JavaScript. Google Fonts are optional; local system fonts are used if the font service is unavailable.

## Resource settings

Edit the `resources` array near the top of `js/app.js` to update names, descriptions, access instructions, and external URLs. The current destinations and shared account details came from the access sheet supplied for this project.

The `sharedAccess` object in `js/app.js` contains the supplied login details. The resource dialog shows usernames, masks passwords until a visitor selects **Show**, and offers copy controls. The LIBROS School ID field shows only a `25-0000` placeholder; visitors must use their own Student or Employee Number on the provider website. The portal does not submit or save that number.

This portal is public. The shared account details are visible in the downloaded JavaScript to every visitor, even while passwords are masked in the interface. Keep these values here only if the library permits public distribution; otherwise move them behind authenticated server access before publishing.

The header uses `logos/lcc_logo.png`. LIBROS uses the same LCC emblem; Gale, IG Publishing, and Tritech use the supplied files in `logos/`. Their paths are set in the `resources` array.

## Virtual tour

The Learning Resource Center virtual tour appears above the Gallery. It uses a Google Drive preview embed, with a direct Drive link as a fallback. The Drive file must be shared with **Anyone with the link** for visitors to watch it. The original local MP4 is excluded by `.gitignore` so it does not block a GitHub push.

## Staff directory

The `staffMembers` array in `js/staff-data.js` contains the eight named staff members and portraits from the [LCC Library staff page](https://sites.google.com/view/lcc-library/library-staff), plus ten student assistants whose names were supplied separately. Student assistants display initials until photos are available. The featured card and both carousels render from this array. A record can include:

```js
{
  id: "unique-id",
  namePrefix: "Dr.", // optional: Dr., Engr., Ms., etc.
  firstName: "First",
  middleInitial: "M.", // optional
  lastName: "Last",
  nameSuffix: "RL, MLIS", // optional credentials after the name
  position: "Librarian",
  image: "assets/staff/photo.jpg", // optional; initials appear if absent or unavailable
  initials: "FL", // optional override when no photo is supplied
  department: "Learning Resource Center",
  description: "Short professional description.",
  email: "", // optional institutional email
  displayOrder: 1 // optional; otherwise peers sort by last name
}
```

Titles and credentials appear with the staff member's name and in the profile details. Keep `firstName` and `lastName` free of titles so sorting works correctly. The Chief Librarian appears in the featured card, regular personnel in Library Team, and Student Assistants in their own carousel. Existing role priority and peer ordering are retained. The carousels move at 18 pixels per second using continuous transforms. Drag or swipe a row, or focus it and use the arrow keys to browse. All staff details appear directly on the cards; cards have no click or hover profile. Reduced-motion preferences stop automatic movement. Change `FLOW_PX_PER_SECOND` in `js/staff.js` to adjust the pace.



## Hero images and appearance

The hero slideshow fills the front page hero section behind the heading. It uses `images/hero-1.png`, `images/hero-2.png`, and `images/hero-3.png`. Replace those placeholder files with your own library photos while keeping the same filenames; the page will pick them up automatically. Wide landscape photos work best. The slideshow advances automatically without visible controls and stops when the visitor prefers reduced motion.

The site uses a single light color scheme. The sticky header uses a white background with navy navigation text.

## Gallery page

The Gallery navigation link opens `gallery.html`. Both the homepage preview and this page use the static files `assets/gallery/photo-1.png` through `photo-4.png`. Replace these images directly and update the captions and alt text in both HTML files.
