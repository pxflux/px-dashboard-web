<template>
  <main ref="main" class="home">
    <div class="logo-wrap">
      <canvas id="px-main-logo"></canvas>
    </div>
    <div class="subtitle" ref="subtitleBox">
      <div v-for="(w, i) in pxSubtitlesWords" :key="i" class="word">
        <span v-for="(l, i) in w" :key="i" ref="subtitleLetters">{{l}}</span>
      </div>
    </div>
    <h1 style="margin-top: 377px; padding: 0 4rem;">
      AN OPEN-SOURCE ECOSYSTEM FOR DIGITALLY BORN TIME-BASED ART
    </h1>
    <div class="wrap-content" ref="wrap">
      <div class="content columns">
        <div class="column">
          <h1>TIME-BASED & DIGITAL ART NOTATION SYSTEM</h1>
          Our Time-based & Digital Art Notation System is a specific data structure and editing environment made for generating extensive artwork related metadata. The aim of the notation system is to record work-defining properties, its conceptual dependencies, aesthetics, and behavior. As the result the notation system allows to capture the artistic intentions which could be accurately translated to different equipment and exhibiting contexts.
        </div>
        <div class="column">
          <h1>ARTWORK PLAYER</h1>
          The Artwork Player is a cross-platform application whose main task is the real-time rendering of code-based artworks as well as the playback of pre-recorded content as video or audio files. It’s made to support multi-channel artworks and allows synchronization of multiple audio/visual sources. Among the traditional video formats, the player currently fully support the rendering of Javascript, WebGL, WebVR, and HTML5.
        </div>
        <div class="column">
          <h1>ARTWORK REMOTE CONTROL</h1>
          The Artwork Remote Control is a mobile app that allows for user interaction and control of artwork. It is also a tool for management of own Artwork Players and artwork libraries.
          Artwork Remote Control also enables artists to utilize all the available sensors and controlling methods of a modern mobile device.
        </div>
        <div class="column">
          <h1>CURATING/ COLLECTION MANAGEMENT TOOLS</h1>
        </div>
        <div class="column">
          <h1>ITERATION REPORTS, BACKUPS & ARCHIVING</h1>
        </div>
        <div class="column">
          <h1>ARTWORK DISTRIBUTION & MARKET PLACE</h1>
        </div>
        <div class="column">
          <h1>LICENSING CERTIFICATION</h1>
        </div>
        <div class="hidden">
          <p>Unlike other media art institutions Pxflux not deal with curating,
            exhibiting, collecting, maintaining, etc. of art works.
            Pxflux works as a host, with its own build futures.
            <em>Pxflux is a platform for making new ideas works!</em>
          </p>
          <p>
            Pxflux consider itself as a new laboratory, or a breading platform,
            solving difficult questions and offering users an outstanding expertise
            in all fields relevant topics related to new digital media art.PxFlux
            atoms & digits & pixels flux!
            New Art Moves!
          </p>
          <p>
            PxFlux is an online open source collaborative platform and software
            infrastructures that enable users
            to make art, and an easy way to distribute, promote, share,
            and collect digital art content. The digital format artworks,
            including film, video, 4K video, video loops, multichannel projections,
            web(net) art, interactive and generative art, VR, computational works and games.
            Pxflux mission to creating a space for diverse art based experience,
            where local and global network of all artists, galleries and
            libraries come together to share, learn etc...
            Platform for building useful tools securely managing and delivering artists works
            to connected display devices of collectors, institutions, private enthusiasts and
            commercial installations around the world. In doing so,
            Pxflux aims to connect people emotionally, exposing global audiences
            to immersive art experiences of moving applications
          </p>
          <p>
            Pxflux is a place for collaboration between artists and programmers!
            pxHost (repository)
            Environment for sketching and development tools of art projects
            Integrateted git
            Environment for testing work (on pxDisplay with pxRemote)
            Presentational tools
            pxDisplay
            pxRemote
            pxStore (market place)
            Distribution & Collection management
            Sertificats
            Payments
            Promotion
            Galleries & Curated collections
            pxCollection
            pxArchive
            Unique recording system that allows archiving the whole life cycle of the artwork.
            Records about the work starting from the first sketches and the communication between
            artist and collaborators during the production, to the iteration reports of the final
            product during shows.
          </p>
          <p>

            Learn about and experience
            Learn artists and their artworks, follow….
            Accessible,without hassle of technical…. ,
            give the viewer the possibility to perceive an artwork from a
            distance while giving the work an autonomous place no matter where it is shown:
            in a public space, a gallery or in a living room.
          </p>
          <p>

            Display ( player)
          </p>
          <p>
            Pxflux develops new software to present very autonomos work.
            The pxPlayer is a cross-platform desktop/stationery computer application whose main task is the playback of
            pre-recorded content as well as the real-time rendering of code-based art works.Visually, the most remarkable
            feature of the pxPlayer application is the absence of any user interface. The player has no buttons, no
            timelines, and no controls whatsoever. This is intended to remove all the destructive elements from the screen
            in order to give its entire space to the artwork itself. All the controls and navigational capabilities are
            delegated to the pxRemote app.
          </p>
          <p>

            Remote
          </p>
          <p>
            The pxRemote is a mobile app that allows for user interaction and control of artwork. It is also
            a browser for our library of works, as well as a communication tool for comments, reviews, and
            sharing across social media networks. It is designed to work on any modern smartphone or
            tablet.
            The goal of separating the remote control and player is to give the viewer the possibility to
            perceive an artwork from a distance while giving the work an autonomous place no matter
            where it is shown: in a public space, a gallery or in a living room.
            At the same time, a user can gain full control of the interactive artwork on their smartphone
            without directly interfering with what is displayed on the screen.
            This also enables artists to utilize all the available sensors and controlling methods of a
            modern mobile device, thereby turning the remote control into a powerful instrument.
            Among the traditional video formats, we currently fully support the rendering of Javascript,
            WebGL, WebVR, and HTML5. Further on in the development will be support for Java
            applications and frameworks like Processing and rendering of Pure-Data patches. We also
            support the basic use of HTTP Live Streaming.
          </p>
          <p>
            Our remote control and the player will provide various permission levels for the access and
            control of the content. This will enable many different uses, from an exhibition visitor using
            their phone to get information on the work being shown, to possibility of multiuser control of
            the interactive artwork, to an owner of the player using their ‘remote control’ to get full access
            to the player and the screen settings.</p>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
  import Color from '../../assets/js/color'
  import Logo from '../../assets/js/logo'

  export default {
    data () {
      return {
        slogan: 'Art that lives in flux of pixels.', // 'Flux of picture elements', // 'Art in flux of pixels',
        logo: null,
        pixelRatio: window.devicePixelRatio || 1
      }
    },
    computed: {
      pxSubtitleLetters () {
        return this.slogan
      },
      pxSubtitlesWords () {
        const txt = this.pxSubtitleLetters.toUpperCase()
        const words = txt.split(' ')
        const pxWords = []
        words.forEach((w, i) => {
          const ll = w.split('')
          ll.push(' ')
          pxWords.push(ll)
        })
        return pxWords
      }
    },

    methods: {
      sPxToBgSize (sPx) {
        if (sPx % 3 === 0) return 3
        if (sPx % 2 === 0) return 2
        return null
      }
    },

    mounted: function () {
      window.addEventListener('resize', () => {
        this.logo.setup(getLogoURL())
      })

      window.addEventListener('changePxSize', e => {
        const sPx = e.detail
        const cssPx = Math.round(sPx / this.pixelRatio)
        let bgSize = this.sPxToBgSize(cssPx)
        if (!bgSize) bgSize = sPx / 4
        const bgFile = `grid-cell-${bgSize}px-o10@${this.pixelRatio}x.png`
        document.body.style.backgroundImage = `url('/static/img/${bgFile}')`
        document.body.style.backgroundSize = bgSize + 'px'

        const subtitle = this.$refs['subtitleBox']
        if (subtitle) subtitle.style.left = 0

        const letters = this.$refs['subtitleLetters']
        if (Array.isArray(letters)) {
          letters.forEach(e => {
            e.style.width = cssPx + 'px'
            e.style.height = cssPx + 'px'
            e.style.lineHeight = cssPx + 'px'
            e.style.marginTop = cssPx + 'px'
            e.style.fontSize = cssPx + 'px'
          })
        }
        this.$nextTick(() => {
          if (subtitle) {
            subtitle.style.left = cssPx * (this.logo.logoLeftSpx) + 'px'
            subtitle.style.top = cssPx * (this.logo.logoTopSpx + this.logo.logoH) + 'px'
          }
          this.$refs['wrap'].style.marginTop = cssPx * (this.logo.logoTopSpx + this.logo.logoH) + cssPx + 'px'
        })
      })

      this.$nextTick(() => {
        let logoURL = getLogoURL()
        const canvasID = 'px-main-logo'
        const options = {
          stroke: true,
          top: 4,
          left: 2,
          mainColor: new Color(203, 16, 26), // new Color(142, 100, 50), //
          strokeColor: new Color(0).setAlpha(0.1),
          fillParent: true
        }
        this.logo = new Logo(logoURL, canvasID, options)
        this.logo.setup()
      })

      function getLogoURL () {
        const el = document.getElementById('px-logo-box')
        const style = window.getComputedStyle(el)
        return style.backgroundImage.slice(4, -1).replace(/"/g, '')
      }
    },

    destroyed () {
      document.body.style.removeProperty('background-image')
      document.body.style.removeProperty('background-size')
    }
  }
</script>

<style lang="scss">
  @import "../../assets/sass/vars";
  @import "../../assets/sass/mixins";
  
  body, #app {
    min-height: 100vh;
    width: 100vw;
    position: relative;
  }
  
  #app {
    display: flex;
    flex-flow: column nowrap;
    
  }
  
  main.home {
    margin-top: 0;
    width: 100vw;
    position: relative;
    flex-grow: 2;
    
    .wrap-content {
      /*margin-top: 20rem;*/
    }
    .subtitle {
      position: absolute;
      display: flex;
      flex-flow: row wrap;
      top: $module-size;
      color: $logo-bg-color;
      font-size: $module-size;
      .word {
        display: flex;
        flex-flow: row nowrap;
      }
      span {
        display: block;
        width: $module-size;
        height: $module-size;
        text-align: center;
        line-height: $module-size;
        overflow: hidden;
        //background: $dark-bg;
      }
    }
  }
  
  footer {
  
  }
  
  .logo-wrap {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  #px-main-logo {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }


</style>
