const core = require("@actions/core");
const parse = require("xml2js").parseString;
const fs = require("fs");

const fileName = core.getInput("file") || "pom.xml";
fs.readFile(fileName, function(err, result) {
    if (err) {
        core.error(err.message);
        return;
    }

    parse(result, function(err, xml) {
        if (err) {
            core.error(err.message);
            return;
        }
        if (!xml.project || !(xml.project.groupId || xml.project.parent[0].groupId) || !xml.project.artifactId || !xml.project.version) {
            core.error("Invalid pom.xml structure");
            return;
        }
        core.setOutput("groupId", xml.project.groupId ? xml.project.groupId[0] : xml.project.parent[0].groupId[0]);
        core.setOutput("artifactId", xml.project.artifactId[0]);
        core.setOutput("version", xml.project.version[0]);
    });
});