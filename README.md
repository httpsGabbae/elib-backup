# LCC eLibrary resource portal

Open `index.html` in a browser or serve this folder with any static web server. No build tools or dependencies are required. The design uses only HTML, CSS, and vanilla JavaScript. Google Fonts are optional; local system fonts are used if the font service is unavailable.

## Resource settings

Edit the `resources` array near the top of `js/app.js` to update names, descriptions, access instructions, and external URLs. The current destinations and shared account details came from the access sheet supplied for this project.

The `sharedAccess` object in `js/app.js` contains the supplied login details. The modal displays usernames and passwords and offers copy and hide controls. The LIBROS School ID field shows only a `25-0000` placeholder; visitors must use their own Student or Employee Number on the provider website. The portal does not submit or save that number.

These shared account details are visible in the downloaded JavaScript to every visitor. If access needs to be restricted, remove the values from this static project and provide them through an authenticated service.

The header uses `logos/lcc_logo.png`. LIBROS uses the same LCC emblem; Gale, IG Publishing, and Tritech use the supplied files in `logos/`. Their paths are set in the `resources` array.

## Virtual tour

The Learning Resource Center virtual tour appears between About the Portal and the Gallery. It uses a Google Drive preview embed, with a direct Drive link as a fallback. The Drive file must be shared with **Anyone with the link** for visitors to watch it. The original local MP4 is excluded by `.gitignore` so it does not block a GitHub push.

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

Titles and credentials appear with the staff member's name and in the profile details. Keep `firstName` and `lastName` free of titles so sorting works correctly. The Chief Librarian appears in the featured card, regular personnel in Library Team, and Student Assistants in their own carousel. Existing role priority and peer ordering are retained. The carousels flow continuously while visible, including while a staff profile is open. Arrows and horizontal swiping briefly pause automatic movement; clicking a staff card does not. Reduced-motion preferences disable automatic movement. Change `FLOW_PX_PER_SECOND` in `js/staff.js` to adjust the pace.

On desktop, hovering over a staff photo shows a quick profile preview after 250 milliseconds. Change the `delay = 250` default in `scheduleStaffPreview` in `js/staff.js` to adjust that wait. Clicking a card opens the full profile. Keyboard focus also shows the preview.

## Theme

The navbar toggle changes the whole site between light and dark modes. The first visit follows the system setting. A manual choice is saved in browser `localStorage` under `lcc-theme`.
