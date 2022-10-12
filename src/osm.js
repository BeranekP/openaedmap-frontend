export async function fetchNodeDataFromOsm(nodeId) {
    const url = `https://www.openstreetmap.org/api/0.6/node/${nodeId}.json`;
    console.log("Request object info for node with osm id:", nodeId, " via url: ", url);
    return fetch(url)
        .then((response) => response.json())
        .then((response) => {
            const node = response.elements[0];
            const tags = Object.fromEntries(
                Object.entries(node.tags).map(([key, val]) => [key.replaceAll(":", "_"), val]),
            );
            const { lon, lat } = node;

            return {
                osm_id: node.id,
                osm_type: "node",
                lat,
                lon,
                ...tags,
            };
        })
        .catch((error) => {
            console.error("Error:", error);
            return {};
        });
}

export function updateOsmUsernameState(auth, setOsmUsername) {
    auth.xhr(
        { method: "GET", path: "/api/0.6/user/details" },
        (err, result) => {
            // result is an XML DOM containing the user details
            if (err) {
                console.log(err);
                throw err;
            }
            const userObject = result.getElementsByTagName("user")[0];
            setOsmUsername(userObject.getAttribute("display_name"));
        },
    );
}

export function getOpenChangesetId(auth, openChangesetId, openChangesetIdSetter, lang) {
    return new Promise((resolve, reject) => {
        if (openChangesetId) {
            console.log("Open changeset exists:", openChangesetId);
            resolve(openChangesetId);
        } else {
            const root = document.implementation.createDocument(null, "osm");
            const changeset = document.createElementNS(null, "changeset");
            const comment = document.createElementNS(null, "tag");
            comment.setAttribute("k", "comment");
            comment.setAttribute("v", "Defibrillator added via https://openaedmap.org #aed");
            const created_by = document.createElementNS(null, "tag");
            created_by.setAttribute("k", "created_by");
            created_by.setAttribute("v", "https://openaedmap.org");
            const locale = document.createElementNS(null, "tag");
            locale.setAttribute("k", "locale");
            locale.setAttribute("v", lang);
            const hashtags = document.createElementNS(null, "tag");
            hashtags.setAttribute("k", "hashtags");
            hashtags.setAttribute("v", "#aed");
            changeset.appendChild(comment);
            changeset.appendChild(created_by);
            changeset.appendChild(locale);
            changeset.appendChild(hashtags);
            root.documentElement.appendChild(changeset);
            const serializer = new XMLSerializer();
            const data = serializer.serializeToString(root);

            auth.xhr({
                method: "PUT",
                path: "/api/0.6/changeset/create",
                content: data,
                options: {
                    header: {
                        "Content-Type": "text/xml",
                    },
                },
            }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    openChangesetIdSetter(res);
                    console.log(`Api returned changeset id: ${res}`);
                    resolve(res);
                }
            });
        }
    });
}

export function addDefibrillatorToOSM(auth, changesetId, data) {
    return new Promise((resolve, reject) => {
        console.log(`sending request to create node in changeset: ${changesetId}`);

        const root = document.implementation.createDocument(null, "osm");
        const node = document.createElementNS(null, "node");
        node.setAttribute("changeset", changesetId);
        node.setAttribute("lat", data.lat);
        node.setAttribute("lon", data.lng);
        const emergency = document.createElementNS(null, "tag");
        emergency.setAttribute("k", "emergency");
        emergency.setAttribute("v", "defibrillator");
        node.appendChild(emergency);
        Object.entries(data.tags).map((arr) => {
            const tag = document.createElementNS(null, "tag");
            tag.setAttribute("k", arr[0]);
            tag.setAttribute("v", arr[1]);
            return tag;
        }).forEach((el) => {
            node.appendChild(el);
        });
        root.documentElement.appendChild(node);
        const serializer = new XMLSerializer();
        const xml = serializer.serializeToString(root);

        console.log(`payload: ${xml}`);
        auth.xhr({
            method: "PUT",
            path: "/api/0.6/node/create",
            content: xml,
            options: {
                header: {
                    "Content-Type": "text/xml",
                },
            },
        }, (err, res) => {
            if (err) reject(err);
            else {
                console.log(`API returned node id: ${res}`);
                resolve(res);
            }
        });
    });
}