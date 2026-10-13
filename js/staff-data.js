/* Staff names, roles, and portraits: https://sites.google.com/view/lcc-library/library-staff */
const staffMembers = [
  { id: "marebel-de-la-cruz", namePrefix: "Dr.", firstName: "Marebel", lastName: "De la Cruz", position: "Chief Librarian", image: "assets/staff/marebel-de-la-cruz.jpg", department: "Learning Resource Center", description: "Oversees the administration, services, collections, and operations of the Learning Resource Center." },
  { id: "hannah-mendonez", namePrefix: "Ms.", firstName: "Hannah", lastName: "Mendonez", nameSuffix: "RL", position: "College Librarian", image: "assets/staff/hannah-mendonez.jpg", department: "Learning Resource Center", description: "Supports college students and faculty in accessing library collections, research materials, and information services." },
  { id: "jacquelyn-capuno", namePrefix: "Ms.", firstName: "Jacquelyn", lastName: "Capuno", nameSuffix: "RL, MLIS", position: "Basic Education Librarian", image: "assets/staff/jacquelyn-capuno.jpg", department: "Learning Resource Center", description: "Provides library and information services for Basic Education students and faculty." },
  { id: "jan-maica-daguismol", namePrefix: "Ms.", firstName: "Jan Maica", lastName: "Daguismol", position: "Library Clerk - College (Circulation Section)", image: "assets/staff/jan-maica-daguismol.jpg", department: "Learning Resource Center", description: "Assists with borrowing, returning, and the circulation of library materials." },
  { id: "buena-lou-plandez", namePrefix: "Ms.", firstName: "Buena Lou", middleInitial: "M.", lastName: "Plandez", position: "Library Clerk - Basic Education", image: "assets/staff/buena-lou-plandez.jpg", department: "Learning Resource Center", description: "Assists with day-to-day library services and materials for Basic Education." },
  { id: "kyla-ann-fababaer", namePrefix: "Ms.", firstName: "Kyla Ann", middleInitial: "L.", lastName: "Fababaer", position: "Library Clerk - College (Graduate School Library)", image: "assets/staff/kyla-ann-fababaer.jpg", department: "Learning Resource Center", description: "Supports library services and access to resources for graduate-level users." },
  { id: "camille-codillo", namePrefix: "Ms.", firstName: "Camille", lastName: "Codillo", position: "Library Clerk - Basic Education", image: "assets/staff/camille-codillo.jpg", department: "Learning Resource Center", description: "Assists with day-to-day library services and materials for Basic Education." },
  { id: "nelinda-alinsunurin", namePrefix: "Ms.", firstName: "Nelinda", middleInitial: "A.", lastName: "Alinsunurin", position: "Library Clerk - Basic Education", image: "assets/staff/nelinda-alinsunurin.jpg", department: "Learning Resource Center", description: "Assists with day-to-day library services and materials for Basic Education." },
  { id: "king-ahron-orense", firstName: "King Ahron", lastName: "Orense", position: "Student Assistant", department: "Learning Resource Center", displayOrder: 1, description: "Supports routine Learning Resource Center services and library operations under staff supervision." },
  { id: "renier-joseph-lopez", firstName: "Renier Joseph", lastName: "Lopez", position: "Student Assistant", department: "Learning Resource Center", displayOrder: 2, description: "Supports routine Learning Resource Center services and library operations under staff supervision." },
  { id: "mclaren-mercado", firstName: "McLaren", lastName: "Mercado", position: "Student Assistant", department: "Learning Resource Center", displayOrder: 3, description: "Supports routine Learning Resource Center services and library operations under staff supervision." },
  { id: "john-royett-gonzales", firstName: "John Royett", lastName: "Gonzales", position: "Student Assistant", department: "Learning Resource Center", displayOrder: 4, description: "Supports routine Learning Resource Center services and library operations under staff supervision." },
  { id: "lei-martin-dimaandal", firstName: "Lei Martin", lastName: "Dimaandal", position: "Student Assistant", department: "Learning Resource Center", displayOrder: 5, description: "Supports routine Learning Resource Center services and library operations under staff supervision." },
  { id: "gizelle-hernandez", firstName: "Gizelle", lastName: "Hernandez", position: "Student Assistant", department: "Learning Resource Center", displayOrder: 6, description: "Supports routine Learning Resource Center services and library operations under staff supervision." },
  { id: "mary-grace-rayoso", firstName: "Mary Grace", lastName: "Rayoso", position: "Student Assistant", department: "Learning Resource Center", displayOrder: 7, description: "Supports routine Learning Resource Center services and library operations under staff supervision." },
  { id: "allyssa-mae-bunag", firstName: "Allyssa Mae", lastName: "Bunag", position: "Student Assistant", department: "Learning Resource Center", displayOrder: 8, description: "Supports routine Learning Resource Center services and library operations under staff supervision." },
  { id: "sarah-kate-orit", firstName: "Sarah Kate", lastName: "Orit", position: "Student Assistant", department: "Learning Resource Center", displayOrder: 9, description: "Supports routine Learning Resource Center services and library operations under staff supervision." },
  { id: "nicole-sandoval", firstName: "Nicole", lastName: "Sandoval", position: "Student Assistant", department: "Learning Resource Center", displayOrder: 10, description: "Supports routine Learning Resource Center services and library operations under staff supervision." },
];

const rolePriority = [
  "Chief Librarian", "Head Librarian", "Senior Librarian", "College Librarian",
  "Basic Education Librarian", "Librarian",
  "Library Clerk - College (Circulation Section)",
  "Library Clerk - College (Graduate School Library)",
  "Library Clerk - Basic Education", "Library Assistant", "Student Assistant", "Other Staff",
];
const roleHeadings = {
  "Senior Librarian": "Senior Librarians",
  Librarian: "Librarians",
  "Library Clerk - College (Circulation Section)": "College Library · Circulation",
  "Library Clerk - College (Graduate School Library)": "College Library · Graduate School",
  "Library Clerk - Basic Education": "Basic Education Library Clerks",
  "Library Assistant": "Library Assistants",
  "Student Assistant": "Student Assistants",
};

function displayName(member) {
  const name = member.fullName || [member.firstName, member.middleInitial, member.lastName].filter(Boolean).join(" ");
  const withPrefix = [member.namePrefix, name].filter(Boolean).join(" ") || "Staff member";
  return member.nameSuffix ? `${withPrefix}, ${member.nameSuffix}` : withPrefix;
}

function groupedStaff(members) {
  const groups = new Map();
  members.forEach((member) => {
    const role = (member.position || "Other Staff").trim() || "Other Staff";
    if (!groups.has(role)) groups.set(role, []);
    groups.get(role).push(member);
  });
  return [...groups].sort(([a], [b]) => {
    const ai = rolePriority.indexOf(a);
    const bi = rolePriority.indexOf(b);
    return (ai < 0 ? rolePriority.length : ai) - (bi < 0 ? rolePriority.length : bi) || a.localeCompare(b);
  }).map(([role, people]) => ({
    role,
    heading: roleHeadings[role] || role,
    people: people.sort((a, b) => {
      const aOrder = Number.isFinite(a.displayOrder) ? a.displayOrder : Infinity;
      const bOrder = Number.isFinite(b.displayOrder) ? b.displayOrder : Infinity;
      return aOrder - bOrder || (a.lastName || "").localeCompare(b.lastName || "") || (a.firstName || "").localeCompare(b.firstName || "");
    }),
  }));
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { staffMembers, displayName, groupedStaff };
}
