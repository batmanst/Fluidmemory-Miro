// function showStatistics(selection) {
//     clear();
//     const statByType = calcByType(selection);
//     getContainer().appendChild(createStatTable('by Type', 'Looks like the selection is empty.', statByType));
// }

// function clear() {
//     const elements = getContainer().getElementsByClassName('stat-list__table');
//     for (let i = 0; i < elements.length; i++) {
//         elements.item(i).remove();
//     }
// }

// function getContainer() {
//     return document.getElementById('stat-container');
// }

// function createStatTable(title, emptyText, data) {
//     const statView = document.createElement('div');
//     statView.className = 'stat-list__table';

//     const titleView = document.createElement('div');
//     titleView.className = 'stat-list__title';
//     titleView.innerHTML = `<span>${title}</span>`;
//     statView.appendChild(titleView);

//     if (data.size === 0) {
//         const emptyView = document.createElement('div');
//         emptyView.className = 'stat-list__empty';
//         emptyView.innerText = emptyText;
//         statView.appendChild(emptyView);
//     } else {
//         data.forEach((value, key) => {
//             let itemView = document.createElement('div');
//             itemView.className = 'stat-list__item';
//             itemView.innerHTML = `<span class="stat-list__item-name">${key.toLowerCase()}</span>` + `<span class="stat-list__item-value">${value}</span>`;
//             statView.appendChild(itemView);
//         });
//     }
//     return statView;
// }

// function calcByType(widgets) {
//     return countBy(widgets, (a) => a.type);
// }

// function countBy(list, keyGetter) {
//     const map = new Map();
//     list.forEach((item) => {
//         const key = keyGetter(item);
//         const count = map.get(key);
//         map.set(key, !count ? 1 : count + 1);
//     });
//     return new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
// }

async function loadTags() {
    widgets = await miro.board.widgets.get({
        type: 'STICKER',
    });
    allTags = [];

    await miro.board.widgets.update(
        widgets.map((widget) => {
            var text = widget.text;
            var tags = widget.tags;

			if (widget.metadata) {
				var metaIds = Object.keys(widget.metadata);

				if (metaIds.length) {
					// Check metaData to know tags are existed
					tags = [];
					metaIds.map((index) => {
						if (widget.metadata[index].tag && widget.metadata[index].tagName) tags.push(widget.metadata[index].tag.tagName);
					});

					splitArray = widget.text.split('Tag: ');
					splitArray.pop();
					text = splitArray.join('Tag: '); // Split Tag: part from the text
				}
			}

            tags.forEach((tag) => {
                if (allTags.indexOf(tag) == -1) {
                    allTags.push(tag);
                }
            });

			widget.text = text;
			widget.tags = tags;
			delete widget.createdUserId;
			delete widget.lastModifiedUserId;

			return widget;
        })
    );

    return allTags;
}

function addTagSelectOptions(tags) {
    tags.forEach((tag) => {
        $('#tag-select').html('');
        $('#tag-select').append(`<option value='${tags}'>${tag}</option>`);
    });
}

miro.onReady(() => {
    // miro.addListener('SELECTION_UPDATED', (e) => {
    //     showStatistics(e.data);
    // });
    // miro.board.selection.get().then(showStatistics);

    loadTags().then(tags => {
		addTagSelectOptions(tags);
	});    
});

$('#metismenu').metisMenu();

$('[data-tabbtn]').on('click', (e) => {
    tabId = $(e.currentTarget).attr('data-tabbtn');
    $('.tab-panel').removeClass('active');
    $(`#${tabId}`).addClass('active');
    $('[data-tabbtn]').removeClass('tab-active');
    $(e.currentTarget).addClass('tab-active');
});
