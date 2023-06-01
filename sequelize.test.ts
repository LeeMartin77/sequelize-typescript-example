import { UserAttributes, models, sequelize } from "./sequelize";

test("Exampling through the multiverse", async () => {
    await sequelize.sync();
    const user = await models.User.create({
        id: 123,
        name: 'Joe Blogs'
    })

    const note = await models.Note.create({
        id: 456,
        title: 'Note Title',
        userId: user.dataValues.id,
        content: "some note content"
    })

    
    const noteTwo = await models.Note.create({
        id: 789,
        title: 'Note Title 2',
        userId: user.dataValues.id,
        content: "some note 2 content"
    })

    const refetch = await models.User.findByPk(user.dataValues.id, {
        include: [models.User.associations.notes],
        rejectOnEmpty: true
    })

    // Typing gets a bit squiffy with nested includes
    // basically, TS doesn't know it exists
    // interface UserWithNotes {
    //     is: string,
    //     name: string,
    //     notes: NoteAttributes[]
    // };

    // const stringArray: (string | number)[] = ["string", 0];
    // const stringTuple: [string, number] = ["string", 0];

    // const [sts, stn] = stringArray;

    // @ts-ignore
    expect(refetch.dataValues.notes[0].title).toBe('Note Title')

    // Raw: true is nice for non-typescript, but we're probably better pulling from
    // data values, because otherwise we have to do some nasty coercion
    const simpleRefetch = await models.User.findByPk(user.dataValues.id, {
        raw: true,
        rejectOnEmpty: true
    }) as any as UserAttributes

    // Ignore time, because time sucks
    // also we don't get intellisense for created/updated at
    // unless we bake them into the types
    const simpleRefetchData = {
        id: simpleRefetch.id,
        name: simpleRefetch.name
    }
    // @ts-ignore
    const { createdAt, updatedAt, ...og} = user.dataValues
    expect(simpleRefetchData).toStrictEqual(og)


    // easier:
    const { dataValues: refetchedFinal } = await models.User.findByPk(user.dataValues.id, {
        rejectOnEmpty: true
    })
    const trimmedRefectchedFinal = {
        id: refetchedFinal.id,
        name: refetchedFinal.name
    }
    expect(trimmedRefectchedFinal).toStrictEqual(og)

    // check we can get user from note?
    // again, tsignores galore
    // @ts-ignore
    const { dataValues: { user: { dataValues: parentUser } }} = await models.Note.findByPk(789, {
        rejectOnEmpty: true,
        include: 'user'
    })
    const trimmedParentUser = {
        id: parentUser.id,
        name: parentUser.name
    }
    expect(trimmedParentUser).toStrictEqual(og)
})