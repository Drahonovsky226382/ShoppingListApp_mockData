export const MOCK_RECIPES = [
  {
    id: "1",
    recipeName: "Carbonara",
    slug: "carbonara",
    ownerId: "123",
    ownerName: "James",
    archived: false,
  },
  {
    id: "2",
    recipeName: "Pasta Bolognese",
    slug: "pastabolognese",
    ownerId: "234",
    ownerName: "Amelia",
    archived: true,
  },
];

export const MOCK_MEMBERS = {
  carbonara: [
    { name: "James", ownerId: "123", userId: null, id: "a1" },
    { name: "Lucie", ownerId: "123", userId: null, id: "a2" },
  ],
  pastabolognese: [{ name: "Amelia", ownerId: "234", userId: null, id: "b1" }],
};

export const MOCK_ITEMS = {
  carbonara: [
    { name: "100g chicken", id: "i1", checked: false },
    { name: "200g spaghetti", id: "i2", checked: true },
  ],
  pastabolognese: [{ name: "150g beef", id: "i3", checked: false }],
};
