import { createWidget } from "discourse/widgets/widget";
import { iconNode } from "discourse-common/lib/icon-library";

export default createWidget("vote-up-button", {
  tagName: "button.btn.btn-primary.vote-button",

  buildClasses(attrs) {
    var buttonClass = "";
    if (attrs.closed) {
      buttonClass = "voting-closed";
    } else {
      if (!attrs.user_upvoted) {
        buttonClass = "nonvote";
      } else {
        if (this.currentUser && this.currentUser.votes_exceeded) {
          buttonClass = "vote-limited nonvote";
        } else {
          buttonClass = "vote";
        }
      }
    }
    if (this.siteSettings.voting_show_who_voted) {
      buttonClass += " show-pointer";
    }
    return buttonClass;
  },

  html(attrs) {
    let icon = iconNode('thumbs-up');
    var buttonTitle = I18n.t("voting.vote_title_plus");
    if (!this.currentUser) {
      if (attrs.vote_count) {
        buttonTitle = I18n.t("voting.anonymous_button_plus", {
          count: attrs.vote_count
        });
      } else {
        buttonTitle = I18n.t("voting.anonymous_button_plus", { count: 1 });
      }
    } else {
      if (attrs.closed) {
        buttonTitle = I18n.t("voting.voting_closed_title");
      } else {
        if (attrs.user_voted) {
          buttonTitle = I18n.t("voting.voted_title");
        } else {
          if (this.currentUser && this.currentUser.votes_exceeded) {
            buttonTitle = I18n.t("voting.voting_limit");
          } else {
            buttonTitle = I18n.t("voting.vote_title_plus");
          }
        }
      }
    }
    // return buttonTitle;
    return icon;
  },

  click() {
    if (!this.currentUser) {
      this.sendWidgetAction("showLogin");
      $.cookie("destination_url", window.location.href);
      return;
    }
    if (
      !this.attrs.closed &&
      this.parentWidget.state.allowClick &&
      !this.attrs.user_upvoted
    ) {
      this.parentWidget.state.allowClick = false;
      this.parentWidget.state.initialVote = true;
      this.sendWidgetAction("upVote");
    } else {
      this.sendWidgetAction("removeUpVote");
    }
    if (this.attrs.user_voted || this.currentUser.votes_exceeded) {
      $(".vote-options").toggle();
    }
  },

  clickOutside() {
    $(".vote-options").hide();
    this.parentWidget.state.initialVote = false;
  }
});
