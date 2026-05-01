const User = require("../models/user.model");

describe("User Model Tests", () => {
    test("should create a user with valid fields", () => {
        const user = new User({
            name: "Satya",
            email: "satya@test.com",
            password: "123456",
        });

        expect(user.name).toBe("Satya");
        expect(user.email).toBe("satya@test.com");
        expect(user.role).toBe("customer"); // default
    });

    test("should fail if required fields are missing", () => {
        const user = new User({});

        const error = user.validateSync();

        expect(error.errors.name).toBeDefined();
        expect(error.errors.email).toBeDefined();
        expect(error.errors.password).toBeDefined();
    });

    test("should only allow valid roles", () => {
        const user = new User({
            name: "Satya",
            email: "satya@test.com",
            password: "123456",
            role: "invalidRole",
        });

        const error = user.validateSync();

        expect(error.errors.role).toBeDefined();
    });

    test("should set isActive to true by default", () => {
        const user = new User({
            name: "Satya",
            email: "satya@test.com",
            password: "123456",
        });

        expect(user.isActive).toBe(true);
    });
});
