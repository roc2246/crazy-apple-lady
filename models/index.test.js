import { expect, test } from 'vitest'
import { findUser, generatePostID } from '.'

test('Find user', async ()=>{
    const user = await findUser("Mindy")
    expect(user.username).toBe("Mindy")
})

test('Type of data for ID', async () => {
    const ID = await generatePostID();
    expect(typeof ID).toBe('number');
    expect(Number.isInteger(ID)).toBe(true);
});