# Contentful Table Field

This is a Contentful UI Extension to create and store tabular data on a JSON field within the Contentful Editor interface

## Installation and usage
[Ensure Contentful CLI is installed](https://github.com/contentful/contentful-cli).

Install the dependencies needed with `npm install`.

To use first export CMA token, followed by creating the extension.

```bash
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<content-management-access-token>
contentful extension create --space-id $SPACE_ID
```

## Update the extension

If you want to update the extension without updating the versioning, run:

```bash
contentful extension update --space-id $SPACE_ID --force
```

## Using the extension in the Contentful web app

Enable the extension in the Contentful web app for a "JSON" field by opening the _Settings_ for a field and selecting the extension in the _appearance_ tab. Then add the necessary configuration for the desired columns below.
