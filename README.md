This is a demo of a Nextjs header that can be plugged into several affiliated websites to perform common tasks.

# Interop notes

## Loading

The header is created with one javascript link:
`https://friend-login-preview.vercel.app/bundle.min.js`
or
`https://friend-login.vercel.app/bundle.min.js`

The app hoists a single global `window.OutsideLogin`. To start the header, make this call:
` [javascript]
if (window.OutsideLogin) window.OutsideLogin.init({
  apiKey: "AmQqVQSG.dF6dRAc3tedCijfsopCQQ0SPf6yzAhbb",
  apiHost: "https://staging-api.rivt.com",
  parentName: "pinkbike",
  callback: () => {},
  selector: "#outside-header",
});
`


## Callback

Provide a callable `callback` argument when starting the header. When the user logs in or out of their
Outside+ account, the `callback` will be called with an object reflecting user status changes.

Several events are defined at the moment:
{
  action: "userProfile",
  user: {...},
}

`user === null` signals a signout by the user.
Otherwise, `user` is an object containing some user information.


## Header actions

Some links in the header simply redirect the user to an Outside+ site.

Some buttons perform actions in the context of the site on which the header is displayed.
These actions can be overriden with the following call:
`
window.OutsideLogin.setButtonCalls({
    join: () => console.log('join clicked'),
    signin: () => console.log('signin clicked'),
    profile: () => console.log('profile clicked'),
});
`
To reset button actions to their defaults, make a subsequent call with `null` as the value for an action, e.g.:
`
window.OutsideLogin.setButtonCalls({
    join: null,
    signin: null,
    profile: null,
});
`
