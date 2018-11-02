export default {
  accountInvitations(state) {
    const { userAccount, invitations } = state;
    if (!userAccount) {
      return [];
    }
    return invitations.filter(
      invitation => invitation.account.id === userAccount[".key"]
    );
  },
  userInvitations(state) {
    const { user, invitations } = state;
    if (!user) {
      return [];
    }
    return invitations.filter(invitation => invitation.email === user.email);
  }
};
