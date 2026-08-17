Hey I want to convert my asp.net core project's static ui to react 19. So we will use react for UI & server side logic for asp.net core [BFF]. I have explained my projects flow below.
 
Axiportal is a SPA [kind of] application used to signup/login & install packages for the main app. It is developed in asp.net core. Axiportal & main app running separatly.  
# ASP.Net core Axiportal:
 
    - wwwroot folder contains static files, assests, client side logics and all.
    - Server side logics are maintained here as well [BFF]
 
    - Flows:
        # signup
            package can be selected to install
            email check model
                - credential
                - SSO
                    - Google
                    - Office365
                    - LinkedIn
            otp verify model
            company details model
            provision model
            packages install page
                - confirmation & info model [if any package selected]
                - progress models
            redirection [direct login]
            email sent to user with account details along with direct login link
        # login
            package can be selected to install
            email check model
                - credential
                - SSO
                    - Google
                    - Office365
                    - LinkedIn
            schema selection
            otp / password verify model [not for SSO flow]
            packages install page (if any selected from home page)
                - confirmation & info model
                - progress models
            redirection
        # packages page
            packages can be installed
            we can see progress of each package installation
            currently we are using redis to see & update the progress [future it will be updated to signalR/websocket]
            after completion all the selected package progress only we can redirect to main app
        # extra
            users can be added to any company after redirected to application [they are called secondary user]
            they can login with their given password or try SSO
            they can able to create their own application separatly as well
            Keep me signin: can be enabled during login, one popup will appear with users names on next time home page load. onclick to direct login [no verification required]
            direct login: user can login directly without any validation after the successfull signup [time limited]
 
 
# React 19 [typescript] + Vite 7 Axiportal
    static level things are converted now we need to focus on the flows
 
 
Note:
    We move UI to react
    Some level of UI conversion done in react, we need to make it work with all the flows
    testing purpose they have added some dependances & code like express, pg, UI logging & all, we can completly remove or ignore them for now.
    BFF will be used for server side logic & will remain same. Can be changed if really needed.
    UI & BFF will be under same domain in production.
        https://axi-global.com/axiportal/                - UI
        https://axi-global.com/axiportal/api/*           - BFF
    Try to replicate same flows, improve structure & code.
    conversion should be better, simple, scalable, secure, effective & structured.

      Make any required changes in the react project

      Do not edit the ui Related code in react project but you can edit functionality code only 