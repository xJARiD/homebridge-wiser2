# homebridge-wiser2

`homebridge-wiser2` is a plugin for [Homebridge](https://github.com/homebridge/homebridge) that adds support for the Wiser2 running firmware version `1.33.1` or later (SpaceLogic C-Bus Home Controller).

> [!IMPORTANT]  
> With the introduction of recent firmware versions, Wiser2 now mandates secure connections via SSL/HTTPS (Port 443 or the defined external port in PICED). This update ensures that remote connections to your Wiser2 controller are secure, as HTTP and Port 80 are no longer supported for remote login.
>
> For more information, refer to the [Wiser2/SLHC Remote Connection for PICED 1.14.2 onward](https://www.se.com/au/en/faqs/FAQ000256860/) article.

The plugin automatically discovers and configures accessories from your Wiser project. To add additional accessories, simply update your Wiser project and restart Homebridge.

## Installation

To install the plugin, use `npm`:

```bash
sudo npm install -g homebridge-wiser2
```

## Migration from `homebridge-wiser`

If you're upgrading from [homebridge-wiser](https://github.com/paulw11/homebridge-wiser), note that the platform name has changed to `homebridge-wiser2`. As a result, all accessories will be re-created.

## Configuration

Add `homebridge-wiser2` to the `platforms` section of your `config.json`:

```json
"platforms": [
  {
    "platform": "homebridge-wiser2",
    "name": "Wiser2",
    "wiserAddress": "https://wiser.local.dns",
    "wiserUsername": "admin",
    "wiserPassword": "yourpassword",
    "wiserPort": "443",
    "ignoredGAs": [
      {
        "network": 254,
        "ga": 4
      },
      {
        "network": 254,
        "ga": 5
      }
    ]
  }
]
```

### Configuration Options

- `platform`: (string) The name of the platform (`homebridge-wiser2`).
- `name`: (string) The name of the platform instance.
- `wiserAddress`: (string) The `https://` URL of your Wiser2 controller.
- `wiserUsername`: (string) The username for your Wiser2 controller (SpaceLogic C-Bus Home Controller).
- `wiserPassword`: (string) The password for your Wiser2 controller (SpaceLogic C-Bus Home Controller).
- `wiserPort`: (integer) The port number of the Wiser2 web server (default is `443`).
- `ignoredGAs`: (array, optional) A list of group addresses to be ignored. Accessories corresponding to these addresses will not be created.

### Usage

Once you've configured the plugin, restart Homebridge. Your SpaceLogic C-Bus Home Controller groups will be automatically discovered and added as new accessories.

> [!NOTE]
> The `wiserPort` should be set to `443` and **not** `8888`.

## Acknowledgments

Special thanks to [Paul Wilkinson](https://github.com/paulw11) for creating the original [homebridge-wiser](https://github.com/paulw11/homebridge-wiser) plugin.
