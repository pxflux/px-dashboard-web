/**
 * maxim tyminko 02.11.17.
 * maximtyminko.com
 */
export default {
  data() {
    return {
      submenuTimeout: null,
      submenuClass: "",
      delayBeforeClose: 1500
    };
  },
  methods: {
    /**
     * @param {Event} event
     */
    toggleSubmenu: function(event) {
      const el = event.currentTarget;
      const submenu = el.parentNode.getElementsByClassName("submenu")[0];
      if (!submenu) {
        return;
      }

      if (submenu.classList.contains("open")) {
        submenu.classList.remove("open");
        this.cancelSubmenuTimeout();
      } else {
        this.closeSubmenus();
        submenu.classList.add("open");
        this.cancelSubmenuTimeout();
      }
    },

    closeSubmenus: function() {
      const openSubmenus = this.$el.querySelectorAll(
        `.${this.submenuClass}.open`
      );
      for (let i = 0; i < openSubmenus.length; i++) {
        openSubmenus[i].classList.remove("open");
      }
      this.cancelSubmenuTimeout();
    },

    /**
     * @param {string} submenuClass
     * @param {string=} submenuTriggerClass
     */
    setupSubmenusWithClass: function(submenuClass, submenuTriggerClass) {
      this.submenuClass = submenuClass;
      submenuTriggerClass = submenuTriggerClass || `${submenuClass}-trigger`;
      const _this = this;
      const triggers = this.$el.querySelectorAll(`.${submenuTriggerClass}`);
      if (!triggers.length) {
        return;
      }
      for (let i = 0; i < triggers.length; i++) {
        const trigger = triggers[i];
        trigger.addEventListener("click", this.toggleSubmenu);
        trigger.addEventListener("mouseleave", function() {
          _this.setSubmenuCloseTimeout(_this.delayBeforeClose);
        });
        trigger.addEventListener("mouseover", function(event) {
          if (_this.currentMenuIsOpen(event)) {
            _this.cancelSubmenuTimeout();
          }
        });
      }
      const submenus = this.$el.querySelectorAll(`.${submenuClass}`);
      for (let i = 0; i < submenus.length; i++) {
        const submenu = submenus[i];
        submenu.addEventListener("mouseleave", function() {
          _this.setSubmenuCloseTimeout(_this.delayBeforeClose);
        });
        submenu.addEventListener("mouseover", function() {
          if (submenu.classList.contains("open")) {
            _this.cancelSubmenuTimeout();
          }
        });
      }
    },
    currentMenuIsOpen(event) {
      const el = event.currentTarget;
      const submenu = el.parentNode.getElementsByClassName("submenu")[0];
      return submenu && submenu.classList.contains("open");
    },
    /**
     * @param {number} sec
     */
    setSubmenuCloseTimeout: function(sec) {
      this.cancelSubmenuTimeout();
      this.submenuTimeout = setTimeout(this.closeSubmenus, sec);
    },
    cancelSubmenuTimeout: function() {
      if (typeof this.submenuTimeout === "number") {
        clearTimeout(this.submenuTimeout);
        this.submenuTimeout = null;
      }
    }
  }
};
