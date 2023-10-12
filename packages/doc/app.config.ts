export default defineAppConfig({
  docus: {
    title: "Ozkar",
    description: "Private & trustless healthcare data framework",
    image: "/img/logo-horizontal.png",
    socials: {
      twitter: "nuxt_js",
      github: "nuxt-themes/docus",
      nuxt: {
        label: "Nuxt",
        icon: "simple-icons:nuxtdotjs",
        href: "https://nuxt.com",
      },
    },
    github: {
      dir: ".starters/default/content",
      branch: "main",
      repo: "docus",
      owner: "nuxt-themes",
      edit: true,
    },
    aside: {
      level: 0,
      collapsed: false,
      exclude: [],
    },
    main: {
      padded: true,
      fluid: true,
    },
    header: {
      logo: false,
      showLinkIcon: true,
      exclude: [],
      fluid: true,
    },
  },
});
