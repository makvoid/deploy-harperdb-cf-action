# HarperDB Custom Functions Deployment Action
GitHub Action to deploy a HarperDB Custom Functions package to an active and public HarperDB Instance. This Action works on HarperDB Cloud Instances, as well as self-hosted Instances as long as they are publicly accessible.

If you would like to see a sample repository using this action, please check out [this repository](https://github.com/makvoid/deploy-harperdb-cf-action-sample).

## Notes
1. Ensure your code has been checked out as a pre-requisite step:
```yml
- name: Checkout
    uses: actions/checkout@v2.7.0
```
2. If your Custom Functions contain dependencies, ensure they are installed before running the action:
```yml
- name: Setup NodeJS
    uses: actions/setup-node@v3
    with:
        node-version: 16
- name: Install dependencies
    run: cd custom_functions && yarn && cd ..
```
3. If you are using a frontend framework like React, ensure your frontend has been built and it's output is placed within the `static` folder inside the Custom Functions directory. It's dependencies will have to be installed beforehand as well.

## Inputs

| Name | Required | Required |
| --- | ---| --- |
| `admin_username` | Yes | Super-user level username to authenticate as |
| `admin_password` | Yes | Password for the user |
| `hdb_endpoint` | Yes | Schema, domain and port of the target HarperDB API. (ex. `https://1.2.3.4:9925` or `https://some-api.example.com`) |
| `project_name` | Yes | Which project to upload the Custom Function package to (ex. `api`) |
| `cf_directory` | Yes | Directory within the repository where the Custom Functions are housed (ex. `custom_functions`) |
| `reject_unauthorized_certs` | Yes | Whether or not to block unauthorized certificates. Values should be `'true'` or `'false'`. |

## Outputs
This action will deploy the Custom Functions package to the endpoint of your choosing automatically. If an existing project of the same name already exists, it will be overwritten.

## Example usage

```yaml
- name: Deploy Custom Functions
    uses: makvoid/deploy-harperdb-cf-action@main
    with:
        admin_username: ${{ secrets.HDB_ADMIN_USERNAME }}
        admin_password: ${{ secrets.HDB_ADMIN_PASSWORD }}
        hdb_endpoint: ${{ secrets.HDB_ENDPOINT }}
        project_name: ${{ secrets.HDB_PROJECT }}
        cf_directory: 'custom_functions'
        reject_unauthorized_certs: 'false'
```
