---
theme: seriph
background: https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## Tech Talk 2026
  A glimpse into the future of our stack.
drawings:
  persist: false
title: Tech Talk 2026
---

# The Future of Our Stack
Tech Talk 2026

Building faster, shipping safer, and scaling smarter.

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-20">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

---
layout: center
---

# Core Initiatives for 2026

Here is what we are focusing on this year:

<v-clicks>

- 🚀 **Performance:** Sub-100ms load times globally.
- 🔒 **Security:** Zero-trust architecture implementation.
- 🤖 **Automation:** AI-driven CI/CD pipelines.
- 📉 **Cost:** Optimizing cloud infrastructure spend.

</v-clicks>

---
layout: default
---

# Code Example: The New API

We are moving towards a more streamlined approach for handling data fetching. Notice the clean syntax.

```ts {all|2|3-5|all}
// api.ts
export async function fetchUserData(userId: string) {
  const response = await fetch(`/api/v2/users/${userId}`);
  if (!response.ok) throw new Error('User not found');
  return response.json();
}