import Vue from "vue";
import Router from "vue-router";

import UserUpdate from "@/components/UserUpdate";

import Overview from "@/components/public/Overview";
import Download from "@/components/public/Download";
import ArtworkList from "@/components/public/ArtworkList";
import ArtworkDetail from "@/components/public/Artwork";
import ArtistDetail from "@/components/public/Artist";
import ShowDetail from "@/components/public/Show";
import PlaceDetail from "@/components/public/Place";
import PlayerClient from "@/components/public/PlayerClient";

import AccountNew from "@/components/account/AccountNew";
import AccountDetail from "@/components/account/AccountDetail";
import AccountInvitationList from "@/components/account/InvitationList";

import AccountPlayerNew from "@/components/account/PlayerNew";
import AccountPlayerList from "@/components/account/PlayerList";
import AccountArtworkIterationDetail from "@/components/account/IterationDetail";
import AccountArtworkEditor from "@/components/account/ArtworkEditor";
import AccountArtistList from "@/components/account/ArtistList";
import AccountArtistDetail from "@/components/account/ArtistDetail";
import AccountArtistEditor from "@/components/account/ArtistEditor";
import AccountShowList from "@/components/account/ShowList";
import AccountShowDetail from "@/components/account/ShowDetail";
import AccountShowEditor from "@/components/account/ShowEditor";
import AccountPlaceList from "@/components/account/PlaceList";
import AccountPlaceDetail from "@/components/account/PlaceDetail";
import AccountPlaceEditor from "@/components/account/PlaceEditor";

Vue.use(Router);

export default new Router({
  routes: [
    { path: "/", component: Overview, name: "home" },
    { path: "/user/update", component: UserUpdate, name: "user-update" },

    { path: "/download", component: Download, name: "download" },

    { path: "/artworks", component: ArtworkList },
    {
      path: "/artwork/:id",
      component: ArtworkDetail,
      name: "artwork-detail"
    },

    { path: "/artist/:id", component: ArtistDetail, name: "artist-detail" },
    { path: "/show/:id", component: ShowDetail, name: "show-detail" },
    { path: "/place/:id", component: PlaceDetail, name: "place-detail" },

    { path: "/p/:id", component: PlayerClient, name: "player-client" },

    { path: "/account/new", component: AccountNew },
    { path: "/account/update", component: AccountDetail },
    { path: "/account/invitations", component: AccountInvitationList },

    { path: "/account/players", component: AccountPlayerList },
    { path: "/account/player/new", component: AccountPlayerNew },

    {
      path: "/account/artwork/:artworkId/iterations/:id",
      component: AccountArtworkIterationDetail
    },
    {
      path: "/account/artwork/new",
      component: AccountArtworkEditor,
      props: { isNew: true }
    },
    {
      path: "/account/artwork/:id/edit",
      component: AccountArtworkEditor,
      props: { isNew: false }
    },

    { path: "/account/artists", component: AccountArtistList },
    {
      path: "/account/artist/new",
      component: AccountArtistEditor,
      props: { isNew: true }
    },
    {
      path: "/account/artist/:id/edit",
      component: AccountArtistEditor,
      props: { isNew: false }
    },
    { path: "/account/artist/:id", component: AccountArtistDetail },

    { path: "/account/shows", component: AccountShowList },
    {
      path: "/account/show/new",
      component: AccountShowEditor,
      props: { isNew: true }
    },
    {
      path: "/account/show/:id/edit",
      component: AccountShowEditor,
      props: { isNew: false }
    },
    { path: "/account/show/:id", component: AccountShowDetail },

    { path: "/account/places", component: AccountPlaceList },
    {
      path: "/account/place/new",
      component: AccountPlaceEditor,
      props: { isNew: true }
    },
    {
      path: "/account/place/:id/edit",
      component: AccountPlaceEditor,
      props: { isNew: false }
    },
    { path: "/account/place/:id", component: AccountPlaceDetail }
  ]
});
