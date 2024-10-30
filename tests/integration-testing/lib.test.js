const db = require("../mock/db.js");
const lib = require('./lib.js');
const mail = require('./mail');
describe('notifyCustomer',()=>{
    it('Should send an email to the customer',()=>{
       /* const jestFunction= jest.fn()
        // mockFunction.mockReturnValue(1)
        // mockFunction.mockResolveValue(1)
        mockFunction.mockRejectedVale(new Error('...'))
        const result=await mockFunction() */


     /*   db.getCustomerSync= function(customerId){
            return{ email:'a'}
        }
        let mailSent=false
        mail.send=function(email,message){
            mailSent=true;
        }
        lib.notifyCustomer({customerId:1}) */
        db.getCustomerSync=jest.fn().mockReturnValue({email:'a'})
        mail.send =jest.fn();

        lib.notifyCustomer({ customerId : 1 });

        expect(mail.send).toHaveBeenCalled();
        expect(mail.send.mock.calls[0][0]).toBe('a');
        expect(mail.send.mock.calls[0][1]).toMatch(/order/);

    });
});