const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { staffMembers, displayName, groupedStaff } = require("../js/staff-data.js");

test("staff records have distinct IDs and their listed portraits exist", () => {
  assert.equal(staffMembers.length, 18);
  assert.equal(new Set(staffMembers.map((member) => member.id)).size, staffMembers.length);
  for (const member of staffMembers) {
    if (member.image) assert.ok(fs.existsSync(path.join(__dirname, "..", member.image)), `${member.id} portrait is missing`);
  }
  const assistants = groupedStaff(staffMembers).find((group) => group.role === "Student Assistant");
  assert.equal(assistants.heading, "Student Assistants");
  assert.deepEqual(assistants.people.map(displayName), [
    "King Ahron Orense", "Renier Joseph Lopez", "McLaren Mercado",
    "John Royett Gonzales", "Lei Martin Dimaandal", "Gizelle Hernandez",
    "Mary Grace Rayoso", "Allyssa Mae Bunag", "Sarah Kate Orit", "Nicole Sandoval",
  ]);
  assert.ok(assistants.people.every((member) => !member.image));
});

test("name titles, initials, and credentials display in the right places", () => {
  assert.equal(displayName(staffMembers[0]), "Dr. Marebel De la Cruz");
  assert.equal(displayName(staffMembers[2]), "Ms. Jacquelyn Capuno, RL, MLIS");
  assert.equal(displayName(staffMembers[4]), "Ms. Buena Lou M. Plandez");
  assert.equal(displayName({ namePrefix: "Engr.", firstName: "Alex", lastName: "Reyes" }), "Engr. Alex Reyes");
});

test("current staff records remain in the grouped directory", () => {
  assert.ok(Array.isArray(staffMembers));
  const groups = groupedStaff(staffMembers);
  assert.equal(groups.reduce((total, group) => total + group.people.length, 0), staffMembers.length);
});

test("people with the same position remain peers and sort by last name", () => {
  const input = [
    { firstName: "Zoe", lastName: "Reyes", position: "Librarian" },
    { firstName: "Ana", lastName: "Cruz", position: "Librarian" },
    { firstName: "Bea", lastName: "Lim", position: "Head Librarian" },
    { firstName: "John", lastName: "Garcia", position: "Librarian" },
  ];
  const groups = groupedStaff(input);
  assert.deepEqual(groups.map((group) => group.role), ["Head Librarian", "Librarian"]);
  assert.deepEqual(groups[1].people.map((person) => person.lastName), ["Cruz", "Garcia", "Reyes"]);
});

test("manual order overrides alphabetic order within its role", () => {
  const groups = groupedStaff([
    { lastName: "Zulu", position: "Library Assistant", displayOrder: 1 },
    { lastName: "Alpha", position: "Library Assistant" },
  ]);
  assert.deepEqual(groups[0].people.map((person) => person.lastName), ["Zulu", "Alpha"]);
});

test("a large group remains one role group", () => {
  const members = Array.from({ length: 28 }, (_, index) => ({
    firstName: `Person${index}`,
    lastName: String(index).padStart(2, "0"),
    position: "Librarian",
  }));
  const groups = groupedStaff(members);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].people.length, 28);
  assert.equal(groups[0].people[0].lastName, "00");
});

