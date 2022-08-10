import { Knex } from "knex";
import { Roles } from "../../enums/roles";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("user_role").del();

    // Inserts seed entries
    await knex("user_role").insert([
        { user_id: "d2188761-fa72-43c1-8705-b8774ad93c8b", role: Roles.user },
        { user_id: "49c081e7-3f32-4413-add2-4b58b1f7e380", role: Roles.user },
        { user_id: "46ff7b62-25c2-4ceb-9253-dfcd3c72d15f", role: Roles.user },
        { user_id: "40da6f3c-7d82-4110-9803-53eabf13689d", role: Roles.user },
        { user_id: "a10ca321-e4e2-44ad-aa03-5bf6be54188b", role: Roles.user },
        { user_id: "533ee893-60bd-4402-8a86-df1ed9d3af27", role: Roles.user },
        { user_id: "099df23c-ade3-4286-b24e-037db4a8db2f", role: Roles.user },
        { user_id: "fba907f9-1d07-4659-bce3-7e13ece25b7e", role: Roles.user },
        { user_id: "2c2d77ea-51db-48b5-9bc3-0c2866944f5e", role: Roles.user },
        { user_id: "d9ec11d0-fbc1-4429-91c6-8d2c9d91b0aa", role: Roles.user },
        { user_id: "67cfe439-358d-4445-8d9f-68e11fe0e5bc", role: Roles.user },
        { user_id: "2ba3ec3f-6188-45d6-94e7-9ef90ee8018f", role: Roles.user },
        { user_id: "7d02ded5-5f89-4435-86a8-e60a0425c3d6", role: Roles.user },
        { user_id: "2dc74bc6-6bf7-4df9-a8cb-db4d9561f5e2", role: Roles.user },
        { user_id: "66f40af9-e8c3-469c-9868-c96200367a00", role: Roles.user },
        { user_id: "78650d7b-25fb-4c11-a77b-5475cb5e487e", role: Roles.user },
        { user_id: "8fd9becd-57b5-4a86-9571-2dbc2ad7f915", role: Roles.user },
        { user_id: "ecba0272-4eb1-45b5-bf4a-6b22ae1538c0", role: Roles.user },
        { user_id: "8dceebcd-901d-480a-a471-0212fa448a00", role: Roles.user },
        { user_id: "5236a48d-6361-435a-9bbf-f117d9dd59ce", role: Roles.user },
        { user_id: "64cfe707-4c2b-446d-a4de-0bad7dbc4153", role: Roles.user },
        { user_id: "db2e49cc-b104-46de-81c6-b62ced822de4", role: Roles.user },
        { user_id: "22a479e9-19f9-43f3-bef1-84685e9fffd4", role: Roles.user },
        { user_id: "472d68c4-71ab-4895-9edf-45b39e0aff78", role: Roles.user },
        { user_id: "b63cf893-55ff-4bd3-9203-41190d77f6f4", role: Roles.user },
        { user_id: "796e45fe-a97e-4b73-b176-861ac7bc45d2", role: Roles.user },
        { user_id: "9406d7d3-4991-4055-9b8c-a6e253ddad85", role: Roles.user },
        { user_id: "72ea81c1-2a39-44ad-ae3b-8a4fda977ad1", role: Roles.user },
        { user_id: "c5e9e342-c312-4bae-935a-c630cfc5a269", role: Roles.user },
        { user_id: "7b839de9-2cc1-4a3a-b289-e380d14c69bd", role: Roles.user },
        { user_id: "e9619580-5b28-412b-b360-76875bb0e704", role: Roles.user },
        { user_id: "8c32dc15-6874-45fd-9b00-9d787c76580c", role: Roles.user },
        { user_id: "18413e53-43c5-4fd8-8628-5ad70d4c1aa8", role: Roles.user },
        { user_id: "fdd6cd5c-29d0-481a-bc4e-261e43c30576", role: Roles.user },
        { user_id: "6693c7d7-3a8a-4dd4-9509-2d2ab2f81528", role: Roles.user },
        { user_id: "e3070934-94c1-4f6b-9278-a31a13f00381", role: Roles.user },
        { user_id: "5f8176d4-00d0-4362-9686-107f30caf229", role: Roles.user },
        { user_id: "f25de2c4-0669-49f5-9e2a-836f9a4fc4dd", role: Roles.user },
        { user_id: "cc089566-63dc-460c-a16e-a04438007683", role: Roles.user },
        { user_id: "575da093-c797-4af0-9794-b30ed3f390b3", role: Roles.user },
        { user_id: "3691b922-2c17-4d5a-9bd5-e003627236db", role: Roles.user },
        { user_id: "f39e00b0-8f1b-4d2a-a531-ecee24d00357", role: Roles.user }
    ]);
};
