import { JSONSchema7 } from "schema-utils/declarations/validate";

export const schema: JSONSchema7 = {
    "title": "Mockoon Webpack plugin",
    "description": "This plugin allow to handle Mockoon servers.",
    "type": "object",
    "additionalProperties": false,
    "required": [
        "pname",
        "port"
    ],
    "properties": {
        "data": {
            "type": "string",
            "title": "The data schema",
            "description": "Path or URL to your Mockoon file.",
            "default": {}
        },
        "mocks": {
            "type": "object",
            "title": "The mocks schema",
            "description": "Object to define mock API.",
            "default": {},
            "properties": {
                "routes": {
                    "type": "array",
                    "items": [
                        {
                            "type": "object",
                            "properties": {
                                "method": {
                                    "type": "string"
                                },
                                "endpoint": {
                                    "type": "string"
                                },
                                "responses": {
                                    "type": "array",
                                    "items": [
                                        {
                                            "type": "object",
                                            "properties": {
                                                "body": {
                                                    "type": "string"
                                                },
                                                "latency": {
                                                    "type": "integer"
                                                },
                                                "statusCode": {
                                                    "type": "integer"
                                                },
                                                "headers": {
                                                    "type": "array",
                                                    "items": [
                                                        {
                                                            "type": "object",
                                                            "properties": {
                                                                "key": {
                                                                    "type": "string"
                                                                },
                                                                "value": {
                                                                    "type": "string"
                                                                }
                                                            },
                                                            "required": [
                                                                "key",
                                                                "value"
                                                            ]
                                                        }
                                                    ]
                                                },
                                                "rules": {
                                                    "type": "array",
                                                    "items": [
                                                        {
                                                            "type": "object",
                                                            "properties": {
                                                                "target": {
                                                                    "type": "string"
                                                                },
                                                                "modifier": {
                                                                    "type": "string"
                                                                },
                                                                "value": {
                                                                    "type": "string"
                                                                },
                                                                "operator": {
                                                                    "type": "string"
                                                                }
                                                            },
                                                            "required": [
                                                                "target",
                                                                "modifier",
                                                                "value",
                                                                "operator"
                                                            ]
                                                        }
                                                    ]
                                                }
                                            },
                                            "required": [
                                                "body",
                                                "statusCode"
                                            ]
                                        }
                                    ]
                                }
                            },
                            "required": [
                                "method",
                                "endpoint",
                                "responses"
                            ]
                        }
                    ]
                },
                "cors": {
                    "type": "boolean"
                },
                "headers": {
                    "type": "array",
                    "items": [
                        {
                            "type": "object",
                            "properties": {
                                "key": {
                                    "type": "string"
                                },
                                "value": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "key",
                                "value"
                            ]
                        }
                    ]
                }
            },
            "required": [
                "routes",
                "cors"
            ]
        },
        "index": {
            "oneOf": [
                {
                    "type": "string"
                },
                {
                    "type": "number"
                }
            ],
            "title": "The index schema",
            "description": "Environment's index in the data file.",
            "default": {}
        },
        "name": {
            "type": "string",
            "title": "The name schema",
            "description": "Environment name in the data file.",
            "default": {}
        },
        "pname": {
            "type": "string",
            "title": "The pname schema",
            "description": "Process name.",
            "default": {}
        },
        "port": {
            "anyOf": [
                {
                    "type": "string"
                },
                {
                    "type": "number"
                }
            ],
            "title": "The port schema",
            "description": "Evironment's port.",
            "default": {}
        },
        "hostname": {
            "type": "string",
            "title": "The hostname schema",
            "description": "Override default listening hostname (0.0.0.0).",
            "default": {}
        },
        "repair": {
            "type": "boolean",
            "title": "The repair schema",
            "description": "If the data file seems too old, or an invalid Mockoon file, migrate/repair without prompting.",
            "default": {}
        }
    }
}