import { expect } from '@wdio/globals'
import logger from '@wdio/logger'

const log = logger('SauceDemoTests')

/**
 * Page object representing the SauceDemo Login Page.
 */
class LoginPage {
    /** Element locators */
    get username() { return $('#user-name') }
    get password() { return $('#password') }
    get loginBtn() { return $('#login-button') }
    get errorMsg() { return $('h3[data-test="error"]') }
    get title() { return $('.app_logo') }

    /**
     * Navigates to the login page.
     */
    async open() {
        log.info('Navigating to the login page')
        await browser.url('https://www.saucedemo.com/')
    }

    /**
     * Attempts to log in with the provided credentials.
     * @param {string} user - The username to input.
     * @param {string} pass - The password to input.
     */
    async login(user, pass) {
        log.info(`Logging in with username: ${user}`)
        await this.username.setValue(user)
        await this.password.setValue(pass)
        await this.loginBtn.click()
    }

    /**
     * Clears the username input field using a workaround for React inputs.
     */
    async clearUsernameInput() {
        log.debug('Clearing username input')
        await this.username.setValue(' ')
        await browser.keys('Backspace')
    }

    /**
     * Clears the password input field using a workaround for React inputs.
     */
    async clearPasswordinput() {
        log.debug('Clearing password input')
        await this.password.setValue(' ')
        await browser.keys('Backspace')
    }

    /**
     * Clears both username and password input fields.
     */
    async clearInputs() {
        await this.clearUsernameInput()
        await this.clearPasswordinput()
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
        log.info('Starting UC-1: Login with empty credentials')

        // Given I have entered credentials and then cleared them
        await loginPage.username.setValue('test')
        await loginPage.password.setValue('test')
        await loginPage.clearUsernameInput()
        await loginPage.clearPasswordinput()

        // When I click the login button
        log.info('Clicking login button with empty credentials')
        await loginPage.loginBtn.click()

        // Then I should see a "Username is required" error message
        log.info('Verifying "Username is required" error message')
        await expect(loginPage.errorMsg)
            .toHaveText(expect.stringContaining('Username is required'))
    })


    /* UC-2 */
    it('UC-2 Login with username but empty password', async () => {
        log.info('Starting UC-2: Login with username but empty password')

        // Given I have entered a valid username and cleared the password
        await loginPage.username.setValue('standard_user')
        await loginPage.password.setValue('test')
        await loginPage.clearPasswordinput()

        // When I click the login button
        log.info('Clicking login button with empty password')
        await loginPage.loginBtn.click()

        // Then I should see a "Password is required" error message
        log.info('Verifying "Password is required" error message')
        await expect(loginPage.errorMsg)
            .toHaveText(expect.stringContaining('Password is required'))
    })


    /* UC-3 with Data Provider */
    validUsers.forEach((user) => {

        it(`UC-3 Login with valid user: ${user}`, async () => {
            log.info(`Starting UC-3: Login with valid user ${user}`)

            // Given I am on the login page (handled by beforeEach)

            // When I login with valid credentials
            await loginPage.login(user, 'secret_sauce')

            // Then I should be navigated to the products page with title "Swag Labs"
            log.info('Verifying successful login by checking page title')
            await expect(loginPage.title)
                .toHaveText('Swag Labs')
        })

    })

})
