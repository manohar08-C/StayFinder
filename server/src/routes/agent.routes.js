const express = require("express");

const {
    stayAgent
} = require("../controllers/agent.controller");


const AgentRouter =
    express.Router();


AgentRouter.post(
    "/stay",
    stayAgent
);


module.exports = {
    AgentRouter
};