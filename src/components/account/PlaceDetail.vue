<template>
  <main>
    <div v-if="userAccount && accountPlace" class="wrap-content text-block">
      <router-link to="/account/places/">Places</router-link>
      <h1>{{ accountPlace.title }}</h1>
      <img v-show="image.displayUrl" :src="image.displayUrl" width="100" height="100">
      <router-link :to="'/account/place/' + placeId + '/update'" class="button">Update</router-link>
      <button @click="removePlace">Remove</button>
      <button v-if=" ! accountPlace.published"><a @click="togglePublished(true)">Publish</a></button>
      <button v-if="accountPlace.published"><a @click="togglePublished(false)">Un publish</a></button>
    </div>
  </main>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { log } from '../../helper'
  import * as firebase from 'firebase'
  import 'firebase/firestore'

  export default {
    created () {
      this.init()
    },
    computed: {
      ...mapState(['userAccount', 'accountPlace']),

      accountId () {
        if (!this.userAccount) {
          return null
        }
        return this.userAccount['.key']
      },
      placeId () {
        return this.$route.params.id
      },
      image () {
        return this.accountPlace && this.accountPlace.image ? this.accountPlace.image : {
          displayUrl: null,
          storageUri: null
        }
      }
    },
    methods: {
      ...mapActions(['setRef', 'lookup']),

      init () {
        this.lookup({ ref: firebase.firestore().collection('places').doc(this.placeId) })
        if (this.accountId) {
          this.setRef({
            key: 'accountPlace',
            ref: firebase.database().ref('accounts/' + this.accountId + '/places/' + this.placeId)
          })
        }
      },
      togglePublished (published) {
//        if (!this.accountId) {
//          return
//        }
//        store(this.accountId, this.placeId, 'places', {published: published}).catch(log())
      },
      removePlace () {
        if (!this.accountId) {
          return
        }
        firebase.database().ref('accounts/' + this.accountId + '/places/' + this.placeId).remove().then(function () {
          this.$router.push('/account/places')
        }.bind(this)).catch(log)
      }
    },
    watch: {
      $route () {
        this.init()
      },
      'userAccount' () {
        this.init()
      }
    }
  }
</script>
