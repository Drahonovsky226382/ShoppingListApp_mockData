import { MOCK_RECIPES, MOCK_MEMBERS, MOCK_ITEMS } from "./mockData";

const USE_MOCK = true;
const baseUri = "http://localhost:3000";

const mockStore = {
  recipes: [...MOCK_RECIPES],
  members: JSON.parse(JSON.stringify(MOCK_MEMBERS)),
  items: JSON.parse(JSON.stringify(MOCK_ITEMS)),
};

async function Call(baseUri, useCase, dtoIn, method = "get") {
  if (USE_MOCK) return MockCall(useCase, dtoIn);

  let response;

  if (!method || method === "get") {
    const qs =
      dtoIn && Object.keys(dtoIn).length
        ? `?${new URLSearchParams(dtoIn)}`
        : "";
    response = await fetch(`${baseUri}/${useCase}${qs}`);
  } else {
    response = await fetch(`${baseUri}/${useCase}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });
  }

  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

function MockCall(useCase, dtoIn = {}) {
  // RECIPE LIST
  if (useCase === "recipe/list") {
    return { ok: true, data: mockStore.recipes };
  }

  // RECIPE GET
  if (useCase === "recipe/get") {
    let recipe = null;
    if (dtoIn.id) {
      recipe = mockStore.recipes.find((r) => r.id === dtoIn.id);
    } else if (dtoIn.slug) {
      recipe = mockStore.recipes.find((r) => r.slug === dtoIn.slug);
    }
    if (!recipe) return { ok: false, status: 404, data: null };
    return { ok: true, data: recipe };
  }

  // RECIPE CREATE
  if (useCase === "recipe/create") {
    const slug = dtoIn.slug;

    const existing = mockStore.recipes.find((r) => r.slug === slug);
    if (existing) {
      return {
        ok: false,
        status: 409,
        data: { message: "Recipe with this name already exists." },
      };
    }

    const newObj = {
      ...dtoIn,
      id: Date.now().toString(),
    };

    mockStore.recipes.push(newObj);
    mockStore.members[newObj.slug] = [
      { id: newObj.ownerId, name: newObj.ownerName, ownerId: newObj.ownerId },
    ];
    mockStore.items[newObj.slug] = [];

    return { ok: true, status: 200, data: newObj };
  }

  // RECIPE UPDATE
  if (useCase === "recipe/update") {
    mockStore.recipes = mockStore.recipes.map((r) =>
      r.id === dtoIn.id ? { ...r, ...dtoIn } : r
    );
    return { ok: true, status: 200, data: {} };
  }

  // RECIPE DELETE
  if (useCase === "recipe/delete") {
    const recipe = mockStore.recipes.find((r) => r.id === dtoIn.id);
    if (recipe) {
      delete mockStore.members[recipe.slug];
      delete mockStore.items[recipe.slug];
    }
    mockStore.recipes = mockStore.recipes.filter((r) => r.id !== dtoIn.id);
    return { ok: true, status: 200, data: {} };
  }

  // MEMBER LIST
  if (useCase === "member/list") {
    const { recipeSlug } = dtoIn;
    return { ok: true, status: 200, data: mockStore.members[recipeSlug] || [] };
  }

  // MEMBER CREATE
  if (useCase === "member/create") {
    const { recipeSlug, member } = dtoIn;
    if (!mockStore.members[recipeSlug]) mockStore.members[recipeSlug] = [];
    mockStore.members[recipeSlug].push(member);
    return { ok: true, status: 200, data: member };
  }

  // MEMBER UPDATE
  if (useCase === "member/update") {
    const { recipeSlug, memberId, ...rest } = dtoIn;
    mockStore.members[recipeSlug] =
      mockStore.members[recipeSlug]?.map((m) =>
        m.id === memberId ? { ...m, ...rest } : m
      ) || [];
    return { ok: true, status: 200, data: {} };
  }

  //  MEMBER DELETE
  if (useCase === "member/delete") {
    const { recipeSlug, memberId } = dtoIn;
    mockStore.members[recipeSlug] =
      mockStore.members[recipeSlug]?.filter((m) => m.id !== memberId) || [];
    return { ok: true, status: 200, data: {} };
  }

  //  ITEM LIST
  if (useCase === "item/list") {
    const { recipeSlug } = dtoIn;
    return { ok: true, status: 200, data: mockStore.items[recipeSlug] || [] };
  }

  // ITEM CREATE
  if (useCase === "item/create") {
    const { recipeSlug, ...rest } = dtoIn;
    const newItem = { id: Date.now().toString(), ...rest };
    if (!mockStore.items[recipeSlug]) mockStore.items[recipeSlug] = [];
    mockStore.items[recipeSlug].push(newItem);
    return { ok: true, status: 200, data: newItem };
  }

  //  ITEM UPDATE
  if (useCase === "item/update") {
    const { recipeSlug, id, ...rest } = dtoIn;
    mockStore.items[recipeSlug] =
      mockStore.items[recipeSlug]?.map((i) =>
        i.id === id ? { ...i, ...rest } : i
      ) || [];
    return { ok: true, status: 200, data: {} };
  }

  // ITEM DELETE
  if (useCase === "item/delete") {
    const { recipeSlug, id } = dtoIn;
    mockStore.items[recipeSlug] =
      mockStore.items[recipeSlug]?.filter((i) => i.id !== id) || [];
    return { ok: true, status: 200, data: {} };
  }

  return { ok: false, status: 400, data: { message: "Unknown useCase" } };
}

const FetchHelper = {
  recipe: {
    list: async (dtoIn) => Call(baseUri, "recipe/list", dtoIn, "get"),
    get: async (dtoIn) => Call(baseUri, "recipe/get", dtoIn, "get"),
    create: async (dtoIn) => Call(baseUri, "recipe/create", dtoIn, "post"),
    update: async (dtoIn) => Call(baseUri, "recipe/update", dtoIn, "post"),
    delete: async (dtoIn) => Call(baseUri, "recipe/delete", dtoIn, "post"),
  },
  member: {
    list: async (dtoIn) => Call(baseUri, "member/list", dtoIn, "get"),
    create: async (dtoIn) => Call(baseUri, "member/create", dtoIn, "post"),
    update: async (dtoIn) => Call(baseUri, "member/update", dtoIn, "post"),
    delete: async (dtoIn) => Call(baseUri, "member/delete", dtoIn, "post"),
  },
  item: {
    list: async (dtoIn) => Call(baseUri, "item/list", dtoIn, "get"),
    create: async (dtoIn) => Call(baseUri, "item/create", dtoIn, "post"),
    update: async (dtoIn) => Call(baseUri, "item/update", dtoIn, "post"),
    delete: async (dtoIn) => Call(baseUri, "item/delete", dtoIn, "post"),
  },
};

export default FetchHelper;
