var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Info = require('../models/info');
var Book = require('../models/book');
var Exam = require('../models/exam');
var Review = require('../models/review');
var Reminder = require('../models/reminder');
var Chat = require('../models/chat');
var Star = require('../models/star');
const { render } = require('ejs');




router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});


router.post('/', function (req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf || !personInfo.studentId) {
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({ email: personInfo.email }, function (err, data) {
				if (!data) {
					var c;
					User.findOne({}, function (err, data) {

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						} else {
							c = 1;
						}

						var newPerson = new User({
							unique_id: c,
							studentId: personInfo.studentId,
							class: personInfo.class,
							email: personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf,

						});

						newPerson.save(function (err, Person) {
							if (err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({ _id: -1 }).limit(1);
					res.send({ "Success": "You are regestered,You can login now." });
				} else {
					res.send({ "Success": "Email is already used." });
				}

			});
		} else {
			res.send({ "Success": "password is not matched" });
		}
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({ email: req.body.email }, function (err, data) {
		if (data) {

			if (data.password == req.body.password) {
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({ "Success": "Success!" });

			} else {
				res.send({ "Success": "パスワード間違った!" });
			}
		} else {
			res.send({ "Success": "メールは登録されてない" });
		}
	});
});

router.get('/profile', function (req, res, next) {
	console.log("profile");
	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		console.log("data");
		console.log(data);
		if (!data) {
			res.redirect('/');
		} else {
			Reminder.find({ user: data.username }, function (err, reminder_data) {
				if (!reminder_data) {
					return res.render('homepage.ejs', { "data": data });
				} else {
					return res.render('homepage.ejs', { "data": data, "reminder": reminder_data });
				}
			})
		}
	});
});

router.get('/user:id?', function (req, res, next) {
	console.log("personal");
	got_id = req.params.id;
	var star = 0;
	User.findOne({ unique_id: got_id }, function (err, data) {
		console.log("data");
		console.log(data);
		if (!data) {
			res.redirect('/profile');
		} else {
			Info.find({ writer: data.username }, function (err, info_data) {
				if (!info_data) {
					info_data = "none";
				}
				Book.find({ owner: data.username }, function (err, book_data) {
					if (!book_data) {
						book_data = "none";
					}
					Review.find({ user: data.username }, function (err, review_data) {
						if (!review_data) {
							review_data = "none";
						}
						for (const onereview of review_data) {
							star += onereview.star;
						}
						star = Math.round(star / review_data.length);
						Star.findOne({ username: data.username }, function (err, stardata) {
							if (!stardata) {
								var c;
								Star.findOne({}, function (err, firstdata) {

									if (firstdata) {
										console.log("if");
										c = firstdata.unique_id + 1;
									} else {
										c = 1;
									}

									var newPerson = new Star({
										unique_id: c,
										star: star,
										username: data.username,
									});

									newPerson.save(function (err, Person) {
										if (err)
											console.log(err);
										else
											console.log('Success');
									});

								}).sort({ _id: -1 }).limit(1);
							} else {
								stardata.star = star;
								stardata.save(function (err, Person) {
									if (err)
										console.log(err);
									else
										console.log('Success');
								});
							}

						});
						return res.render('user.ejs', { "book": book_data, "info": info_data, "user": data, "review": review_data.reverse(), "star": star });
					})

				})
			})

		}
	});
});

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
		// delete session object
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/login');
			}
		});
	}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({ email: req.body.email }, function (err, data) {
		console.log(data);
		if (!data) {
			res.send({ "Success": "メールは登録されてない" });
		} else {
			if (data.studentId == req.body.studentId) {
				// res.send({"Success":"Success!"});
				if (req.body.password == req.body.passwordConf) {
					data.password = req.body.password;
					data.passwordConf = req.body.passwordConf;

					data.save(function (err, Person) {
						if (err)
							console.log(err);
						else
							console.log('Success');
						res.send({ "Success": "パスワード変わった！" });
					});
				} else {
					res.send({ "Success": "パスワード同じじゃない！！" });
				}
			} else {
				res.send({ "Success": "学生番号間違った！" });
			}
		}
	});

});

router.get('/info', function (req, res, next) {

	Info.find({}, function (err, data) {
		console.log("data");
		console.log(data);
		if (!data) {
			return res.render('info.ejs', { "topic": "Nothing", "review": "Nothing" });
		} else {
			//console.log("found");
			data = data.reverse();
			return res.render('info.ejs', { "info": data });
		}
	});
});
router.post('/info', function (req, res, next) {
	console.log(req.body);

	var review = req.body;

	var today = new Date();
	var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date + ' ' + time;
	User.findOne({ unique_id: req.session.userId }, function (err, userdata) {
		if (userdata) {
			var c;
			Info.findOne({}, function (err, data) {
				if (data) {

					c = data.unique_id + 1;
				} else {
					c = 1;
				}
				Exam.findOne({ unique_id: review.select }, function (err, exam_data) {


					var newInfo = new Info({
						unique_id: c,
						topic: review.topic,
						review: review.review,
						date: dateTime,
						exam: review.select,
						exam_name: exam_data.name,
						writer: userdata.username,
						writer_id: userdata.unique_id,
						points: review.points,
						exam_count: review.exam_count,
						study_period: review.study_period,
						used_book: review.used_book,
						study_style: review.study_style,
						advice: review.advice,
						next_target: review.next_target,
					});

					newInfo.save(function (err, Person) {
						if (err)
							console.log(err);
						else
							console.log('Success');

					});
				});
			}).sort({ _id: -1 }).limit(1);
			res.send({ "Success": "Posted" });

		} else {
			res.send({ "Success": "loginplease" });
		}


	});

});

router.get('/connect', function (req, res, next) {
	return res.render('connect.ejs');
});

router.get('/sell', function (req, res, next) {
	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		if (!data) {
			console.log("loginplease");
			return res.render('login.ejs');
		} else {
			console.log("data");
			console.log(data);

			return res.render('sell.ejs');
		}
	});


});

router.post('/sell', function (req, res, next) {

	console.log(req.body);

	var review = req.body;

	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		if (!data) {
			res.send({ "Success": "loginplease" });
		} else {
			console.log("data");
			console.log(data);
			var c;
			var owner = data.username
			Book.findOne({}, function (err, data) {
				if (data) {
					c = data.unique_id + 1;
				} else {
					c = 1;
				}
				var newBook = new Book({
					unique_id: c,
					bookname: review.bookname,
					owner: owner,
					picture: review.image,
					price: review.price,
					sold: 0,
					genre: review.genre,
					description: review.description
				});

				newBook.save(function (err, Person) {
					if (err)
						console.log(err);
					else
						console.log('Success');

				});
			}).sort({ _id: -1 }).limit(1);
			res.send({ "Success": "Posted" });
		}
	});




});
router.get('/selling', function (req, res, next) {

	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		if (!data) {
			console.log("loginplease");
			return res.render('login.ejs');
		} else {
			console.log("data");
			console.log(data);

			var user = data.username
			Book.find({ owner: user }, function (err, data) {
				console.log("book_data");
				console.log(data);
				if (!data) {
					return res.render('selling.ejs');
				} else {
					//console.log("found");
					return res.render('selling.ejs', { "book": data });
				}
			});
		}
	});
});
router.get('/selling/delete/:id', function (req, res, next) {

	got_id = req.params.id;
	Book.deleteOne({ unique_id: got_id }, function (err, data) {
		return res.redirect('/selling');
	});
});
router.get('/about', function (req, res, next) {
	return res.render('about.ejs');
});
router.get('/calender', function (req, res, next) {
	return res.render('calender.ejs');
});

router.get('/exam', function (req, res, next) {


	Exam.find({}, function (err, data) {


		if (!data) {
			return res.render('exam.ejs');
		} else {
			//console.log("found");
			Info.find({}, function (err, infodata) {

				Book.find({}, function (err, book_data) {
					return res.render('exam.ejs', { "exams": data, "infos": infodata, "books": book_data });
				})
			})

		}
	});
});

router.get('/exams', function (req, res, next) {
	Exam.find({}, function (err, data) {
		return res.render('exams.ejs', { "exam": data });
	});
});
router.get('/oneexam:id', function (req, res, next) {

	got_id = req.params.id;
	Exam.findOne({ unique_id: got_id }, function (err, data) {
		console.log("data");

		if (!data) {
			return res.render('exam.ejs');
		} else {
			//console.log("found");
			Info.find({ exam: got_id }, function (err, infodata) {

				Book.find({ genre: got_id }, function (err, book_data) {
					return res.render('oneexam.ejs', { "oneexam": data, "infos": infodata, "books": book_data });
				})
			})

		}
	});
});

router.get('/onepost:id', function (req, res, next) {

	got_id = req.params.id;
	Info.findOne({ unique_id: got_id }, function (err, data) {
		console.log("data");

		if (!data) {
			return res.render('exam.ejs', { "topic": "Nothing", "review": "Nothing" });
		} else {


			return res.render('onepost.ejs', { "info": data });
		}
	});
});

router.get('/review:id', function (req, res, next) {
	user_name = req.params.id;
	User.findOne({ username: user_name }, function (err, userdata) {
		if (userdata) {
			return res.render('review.ejs', { 'username': userdata.username });
		}

	})


});
router.post('/review', function (req, res, next) {
	console.log(req.body);

	var review = req.body;

	var today = new Date();
	var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date + ' ' + time;
	User.findOne({ unique_id: req.session.userId }, function (err, userdata) {
		if (userdata) {
			var c;
			Review.findOne({}, function (err, data) {
				if (data) {

					c = data.unique_id + 1;
				} else {
					c = 1;
				}
				var newReview = new Review({
					unique_id: c,
					review: review.comment,
					date: dateTime,
					user: review.username,
					writer: userdata.username,
					star: review.stars,
				});

				newReview.save(function (err, Person) {
					if (err)
						console.log(err);
					else
						console.log('Success');

				});
			}).sort({ _id: -1 }).limit(1);
			res.send({ "Success": "Posted" });

		} else {
			res.send({ "Success": "loginplease" });
		}


	});

});

router.get('/test', function (req, res, next) {

	return res.render('test.ejs');
});
router.post('/test', function (req, res, next) {
	var image = req.body;
	console.log(image.image);

	Picture.findOne({}, function (err, data) {
		if (data) {

			c = data.unique_id + 1;
		} else {
			c = 1;
		}
		var newPicture = new Picture({
			unique_id: c,
			link: image.image,
		});

		newPicture.save(function (err, Person) {
			if (err)
				console.log(err);
			else
				console.log('Success');

		});
	}).sort({ _id: -1 }).limit(1);

	res.end("Image uploaded Successfully");
});
router.get('/account', function (req, res, next) {
	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		if (!data) {
			console.log("loginplease");
			return res.render('login.ejs');
		} else {
			console.log("data");
			console.log(data);

			return res.render('account.ejs', { "data": data });
		}
	});


});
router.post('/account', function (req, res, next) {
	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		console.log(data);
		if (!data) {
			res.send({ "Success": "loginplease" });
		} else {

			data.picture = req.body.image;
			data.contact = req.body.contact;
			data.description = req.body.description;
			data.save(function (err, Person) {
				if (err)
					console.log(err);
				else
					console.log('Success');
				res.send({ "Success": "Posted" });
			});

		}
	});
});
router.get('/game', function (req, res, next) {
	var url = ""
	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		if (!data) {
			console.log("login please");
			return res.render('login.ejs');
		} else {
			Book.find({ sold: "0", owner: { $ne: data.username } }, function (err, bookData) {
				if (err) throw err;
				Reminder.find({ user: data.username }, function (err, reminder_data) {
					if (!reminder_data) {
						return res.render('game.ejs', { "data": data });
					} else {
						return res.render('game.ejs', { 'bookData': bookData, 'go_to_where': "aaa[0].url", "data": data, "reminder": reminder_data });
					}
				})
				// console.log(bookData);
				// // console.log(aaa[0].url)
				// return res.render('game.ejs', { 'bookData': bookData, 'go_to_where': "aaa[0].url" });
			})
		}
	});
})

router.get('/check', function (req, res, next) {

	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		if (!data) {
			console.log("loginplease");
			return res.render('login.ejs');
		} else {

			Book.find({ sold: "0", owner: { $ne: data.username } }, function (err, bookData) {
				if (err) throw err;
				// console.log(bookData)
				Star.find({}, function (err, stardata) {
					if (err) throw err;
					if(!stardata){
						console.log("no star data!")
					}
					console.log(stardata)
					return res.render('check.ejs', { 'bookData': bookData, 'starData': stardata });
				})

			});

		}
	});

})
router.get('/buy:id?', function (req, res, next) {
	console.log("buy book");
	var today = new Date();
	var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date + ' ' + time;
	book_id = req.params.id;

	Book.findOne({ unique_id: book_id }, function (err, book_data) {
		console.log("data");
		console.log(book_data);
		if (!book_data) {
			res.redirect('/error');
		} else {
			User.findOne({ username: book_data.owner }, function (err, owner_data) {
				if (!owner_data) {
					owner_data = "none";
				}
				User.findOne({ unique_id: req.session.userId }, function (err, buyer_data) {
					if (!buyer_data) {
						buyer_data = "none";
					} else {
						book_data.buyer = buyer_data.username;
						book_data.sold = 1;
						book_data.save(function (err, Person) {
							if (err)
								console.log(err);
							else
								console.log('Success');

						});
						var c;
						Reminder.findOne({}, function (err, reminder_data) {
							if (reminder_data) {

								c = reminder_data.unique_id + 1;
							} else {
								c = 1;
							}
							var newReminder = new Reminder({
								unique_id: c,
								user: owner_data.username,
								date: dateTime,
								content: buyer_data.username + "さんがあなたの本" + book_data.bookname + "を保留しておりました！",
								group: "buy"
							});

							newReminder.save(function (err, Person) {
								if (err)
									console.log(err);
								else
									console.log('Success');

							});

						}).sort({ _id: -1 }).limit(1);
						console.log('Success');

						return res.redirect('/waiting_list');
					}
				})
			})

		}
	});
});
router.get('/reminder_delete:id', function (req, res, next) {
	User.findOne({ unique_id: req.session.userId }, function (err, data) {

		if (!data) {
			res.redirect('/');
		} else {
			Reminder.find({ user: data.username }, function (err, reminder_data) {
				got_id = req.params.id;
				Reminder.deleteOne({ unique_id: got_id }, function (err, data) {
					return res.redirect('/reminder');
				});
			})
		}
	});
});
router.get('/reminder', function (req, res, next) {
	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		console.log("data");
		console.log(data);
		if (!data) {
			res.redirect('/');
		} else {
			Reminder.find({ user: data.username }, function (err, reminder_data) {
				if (!reminder_data) {
					return res.render('reminder.ejs', { "reminder_data": "なし" });
				} else {
					console.log(reminder_data);
					return res.render('reminder.ejs', { "reminder_data": reminder_data.reverse() });
				}
			})
		}
	});
});
router.get('/chat:id', function (req, res, next) {
	username2 = req.params.id;
	User.findOne({ unique_id: req.session.userId }, function (err, user_data) {
		console.log("user_data");
		if (!user_data) {
			res.redirect('/');
		} else {
			User.findOne({ username: username2 }, function (err, user2_data) {
				if (!user2_data) {
					res.redirect('/');
				} else {
					Chat.find({ $or: [{ username1: user_data.username, username2: user2_data.username }, { username1: user2_data.username, username2: user_data.username }] }, function (err, chat_data) {
						if (!chat_data) {
							return res.render('chat.ejs', { "chat_data": "なし" });
						} else {
							return res.render('chat.ejs', { "chat_data": chat_data.reverse(), "user2_data": user2_data });
						}
					})
				}
			});

		}
	});
});
router.post('/chat', function (req, res, next) {

	console.log(req.body);
	var today = new Date();
	var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date + ' ' + time;
	var content = req.body;
	username2_id = content.username2;
	User.findOne({ unique_id: req.session.userId }, function (err, user_data) {
		if (!user_data) {
			res.send({ "Success": "loginplease" });
		} else {
			console.log("data");
			console.log(user_data);
			var c;

			User.findOne({ unique_id: username2_id }, function (err, user2_data) {
				Chat.findOne({}, function (err, chat_data) {
					if (chat_data) {
						c = chat_data.unique_id + 1;
					} else {
						c = 1;
					}
					var newChat = new Chat({
						unique_id: c,
						username1: user_data.username,
						username2: user2_data.username,
						content: content.content,
						date: dateTime,

					});

					newChat.save(function (err, Person) {
						if (err)
							console.log(err);
						else
							console.log('Success');

					});
					var d;
					Reminder.findOne({}, function (err, reminder_data) {
						if (reminder_data) {

							d = reminder_data.unique_id + 1;
						} else {
							d = 1;
						}
						var newReminder = new Reminder({
							unique_id: d,
							user: user2_data.username,
							date: dateTime,
							content: user_data.username + "からメッセージがきました!",
							group: "message",
							sender: user_data.username
						});

						newReminder.save(function (err, Person) {
							if (err)
								console.log(err);
							else
								console.log('Success');

						});
					}).sort({ _id: -1 }).limit(1);
					res.send({ "Success": "Posted" });
				});
			});

		}
	});


});
router.get('/waiting_list', function (req, res, next) {

	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		if (!data) {
			console.log("loginplease");
			return res.render('login.ejs');
		} else {
			console.log("data");
			console.log(data);

			var user = data.username
			Book.find({ buyer: user,sold: "1" }, function (err, data) {
				console.log("book_data");
				console.log(data);
				if (!data) {
					return res.render('waiting_list.ejs');
				} else {
					//console.log("found");
					return res.render('waiting_list.ejs', { "book": data });
				}
			});
		}
	});
});
router.get('/finish:id?', function (req, res, next) {
	console.log("finish_page");
	var today = new Date();
	var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date + ' ' + time;
	book_id = req.params.id;

	Book.findOne({ unique_id: book_id }, function (err, book_data) {
		console.log("data");
		console.log(book_data);
		if (!book_data) {
			res.redirect('/error');
		} else {
			User.findOne({ username: book_data.owner }, function (err, owner_data) {
				if (!owner_data) {
					owner_data = "none";
				}
				User.findOne({ unique_id: req.session.userId }, function (err, buyer_data) {
					if (!buyer_data) {
						buyer_data = "none";
					} else {
						
						book_data.sold = 2;
						book_data.save(function (err, Person) {
							if (err)
								console.log(err);
							else
								console.log('Success');

						});
						var c;
						Reminder.findOne({}, function (err, reminder_data) {
							if (reminder_data) {

								c = reminder_data.unique_id + 1;
							} else {
								c = 1;
							}
							var newReminder = new Reminder({
								unique_id: c,
								user: owner_data.username,
								date: dateTime,
								content: buyer_data.username + "さんがあなたの本" + book_data.bookname + "購入完了！",
								group: "finish"
							});

							newReminder.save(function (err, Person) {
								if (err)
									console.log(err);
								else
									console.log('Success');

							});

						}).sort({ _id: -1 }).limit(1);
						console.log('Success');

						return res.redirect('/review'+owner_data.username);
					}
				})
			})

		}
	});
});
module.exports = router;