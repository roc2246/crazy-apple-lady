import { expect, test } from 'vitest'
import { findUser } from '.'

test('Find user', async ()=>{
    const user = await findUser("Mindy")
    expect(user.username).toBe("Mindy")
})