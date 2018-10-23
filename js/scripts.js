$(document).ready(function(){
	
	//Get and show GitHub username
	$('.form-signin').on('submit', (e) => {
		e.preventDefault();
		let userName = $.trim($('#inputUsername').val());
		$('.form-signin .btn-block').attr('disabled', true);
		$.ajax({
			url: "https://api.github.com/users/"+userName+"/repos",
			success: (result) => {
				$('.form-signin .btn-block').attr('disabled', false);
				$('.results-wrapper ul').html('');
				$(result).each((index, item)=>{
					$('.results-wrapper ul').append(`<li class="col-xs-12 col-sm-6 col-lg-4"><h4>${item.name}</h4><p class="desc">${item.description}</p><p class="lastUpdated">${new Date(item.updated_at).toUTCString()}</p><p class="openIssues"><span class="openIssue">${item.open_issues_count} Open defects</span><span class="raiseNewIssue"><button class="btn btn-xs btn-block" type="button" data-toggle="modal" data-target="#createIssueModal" data-name="${item.name}">Raise New</button></span></p></li>`);
				});
				
			},
			error: (error) => {
				alert('Error fetching data');
				$('.form-signin .btn-block').attr('disabled', false);
			}
		})
	});

	//Modal's
	$('#createIssueModal').on('show.bs.modal', function (event) {
	  var button = $(event.relatedTarget);
	  var recipient = button.data('name');
	  var modal = $(this)
	  modal.find('.modal-title').text('New defect for ' + recipient + ' repo');
	  modal.find('#repo-name').val(recipient);
	});

	//Create new defets
	$('.raise-defect').on('submit', (e) => {
		e.preventDefault();
		let userName = $.trim($('#inputUsername').val());
		let repoName = $.trim($('#repo-name').val());		
		let newDefect = {
		  "title": $.trim($('#title-name').val()),
		  "body": $.trim($('#description-text').val())
		}

		$.ajax({
			url: "https://api.github.com/repos/"+userName+"/"+repoName+"/issues",
			method: "POST",
			beforeSend: function(xhr) {
		      xhr.setRequestHeader("Authorization", "token " + $('#access-token').val());
		    },
		    data: JSON.stringify(newDefect),
			success: (result) => {
				$('#createIssueModal').modal('hide');
				$('.form-signin').trigger('submit');
			},
			error: (error) => {
				alert('Error posting data');
				$('#createIssueModal').modal('hide');
			}
		})
	});

});