export default {
        extensionsToTreatAsEsm: [".ts"],
        testEnvironment: "node",
        transform: {
                "^.+\\.ts$": [
                        "ts-jest",
                        {
                                useESM: true,
                                tsconfig: "tsconfig.test.json",
                        },
                ],
        },
};
