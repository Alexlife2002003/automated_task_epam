import { expect } from '@wdio/globals'

class LoginPage {

    get username() { return $('#user-name') }
    get password() { return $('#password') }
    get loginBtn() { return $('#login-button') }
    get errorMsg() { return $('h3[data-test="error"]') }
    get title() { return $('.app_logo') }

    async open() {
        await browser.url('https://www.saucedemo.com/')
    }

    async login(user, pass) {
        await this.username.setValue(user)
        await this.password.setValue(pass)
        await this.loginBtn.click()
    }

    async clearUsernameInput() {
        await this.username.setValue(' ')
        await browser.keys('Backspace')
    }

    async clearPasswordinput() {
        await this.password.setValue(' ')
        await browser.keys('Backspace')
    }

}

const loginPage = new LoginPage()

const validUsers = [
    'standard_user',
    'problem_user',
    'performance_glitch_user'
]

describe('SauceDemo Login Tests', () => {

    beforeEach(async () => {
        await loginPage.open()
    })

    /* UC-1 */
    it('UC-1 Login with empty credentials', async () => {

        console.log('Running UC-1')

        await loginPage.username.setValue('test')
        await loginPage.password.setValue('test')

        await loginPage.clearUsernameInput()
        await loginPage.clearPasswordinput()

        await loginPage.loginBtn.click()

        await expect(loginPage.errorMsg)
            .toHaveText(expect.stringContaining('Username is required'))
    })


    /* UC-2 */
    it('UC-2 Login with username but empty password', async () => {

        console.log('Running UC-2')

        await loginPage.username.setValue('standard_user')
        await loginPage.password.setValue('test')

        await loginPage.clearPasswordinput()

        await loginPage.loginBtn.click()

        await expect(loginPage.errorMsg)
            .toHaveText(expect.stringContaining('Password is required'))
    })


    /* UC-3 with Data Provider */
    validUsers.forEach((user) => {

        it(`UC-3 Login with valid user: ${user}`, async () => {

            console.log(`Running UC-3 with ${user}`)

            await loginPage.login(user, 'secret_sauce')

            await expect(loginPage.title)
                .toHaveText('Swag Labs')

        })

    })

})
