/* global QUnit dataBaseClass */
QUnit.test("Send Message", function testSend(assert) {
    var doneSendMessage = assert.async();
    assert.expect(1);
    dataBaseClass.sendMsg("/-LFcMCPpvBW7DbDHsubO", "Hello )").then(
        function check(value) {
            assert.ok(value, "message send");
            doneSendMessage();
        }
    )
});
QUnit.test("Get Messages", function testMessages(assert) {
    var doneGetMessage = assert.async();
    dataBaseClass.getUserMessages("/-LFcMCPpvBW7DbDHsubO").then(
        function check(value) {
            assert.ok(value, "Message is received");
            assert.equal("Hello )", value.pop(), "Correct message");
            doneGetMessage();
        }
    )
});

QUnit.test("Get users list", function getList(assert) {
    var doneListIsReceived = assert.async();
    var testObjectUser;
    assert.expect(5);
    dataBaseClass.usersList().then(function usersList(value) {
        assert.ok(value, "List is received");
        testObjectUser = value[0];
        assert.ok(Object.prototype.hasOwnProperty.call(testObjectUser, "name"), "There is a name property");
        assert.ok(Object.prototype.hasOwnProperty.call(testObjectUser, "id"), "There is a id property");
        assert.ok(Object.prototype.hasOwnProperty.call(testObjectUser, "online"), "There is a online property");
        assert.ok(Object.prototype.hasOwnProperty.call(testObjectUser, "unreadMessage"), "There is a unreadMessage property");
        doneListIsReceived();
    })
});

QUnit.test("Set message read", function setRead(assert) {
    var doneMessageSetRead = assert.async();
    assert.expect(1);
    dataBaseClass.setMessageRead("-LFcMCPpvBW7DbDHsubO").then(function setMessageRead(value) {
        assert.ok(value, "set read");
        doneMessageSetRead();
    })
});


QUnit.test("Check message read", function checkRead(assert) {
    var doneMessageCheck = assert.async();
    assert.expect(2);
    dataBaseClass.usersList().then(function check(value) {
        assert.ok(value, "List is received");
        assert.notOk(value[0].unreadMessage, "message read, ok!");
        doneMessageCheck();
    })
});
QUnit.test("Get user chat config", function getConfig(assert) {
    var doneUserChatConfig = assert.async();
    assert.expect(5);
    dataBaseClass.getUserConfig("-LFcMCPpvBW7DbDHsubO").then(function check(value) {
        assert.ok(value, "config is received");
        assert.ok(Object.prototype.hasOwnProperty.call(value, "CSS"), "There is a CSS property");
        assert.ok(Object.prototype.hasOwnProperty.call(value, "userName"), "There is a userName property");
        assert.ok(Object.prototype.hasOwnProperty.call(value, "url"), "There is a url property");
        assert.ok(Object.prototype.hasOwnProperty.call(value, "network"), "There is a network property");
        doneUserChatConfig();
    })
});
