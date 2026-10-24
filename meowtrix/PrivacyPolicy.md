# Meowtrix Privacy Policy / 喵阵隐私政策 / プライバシーポリシー

Developer / 开发者 / 開発者：**黎达文**\
Contact / 联系邮箱 / お問い合わせ：**dawenhing+support@gmail.com**\
Effective date / 生效日期 / 適用開始日：**2026-10-24**

## English

This policy distinguishes iOS, the WeChat Mini Game and shared puzzle web pages. iOS rankings use Unity; WeChat rankings use Tencent CloudBase. The WeChat version does not currently initialize the iOS AdMob, Firebase or Apple subscription SDKs. iOS player-card edits remain local; its rankings currently show a generated cat name and public player number.

### Game data

Meowtrix is a logic puzzle game. You do not need to register or provide a name or email address. Game progress, board state, tutorial progress, hint balance, daily check-in progress, collected artwork, and preferences are stored on your device. The complete saved game stays on your device; selected ranking and reward records are sent to the service for your platform as described below. Device backup and restore may be managed by your operating system.

### iOS: Unity leaderboards and rewards

Meowtrix uses Unity Authentication, Leaderboards, Cloud Code and Cloud Save. An anonymous player ID is created automatically, and a session token is saved locally to retain it. Unity processes IP addresses for these services. Rankings are gameplay functionality, separate from optional advertising and analytics consent; we do not use leaderboard IDs for advertising tracking.

Daily points, challenge completion times and board dates are sent to Unity. Other players see ranks, scores or times, a generated cat name and public player number. Reward records contain player ID, period, rank, hint quantity and delivery acknowledgement to prevent duplicate awards. The full board save and hint wallet are not backed up to Unity; cross-device save recovery is not provided.

Date-specific challenge boards are scheduled for deletion after 35 days. Points archives and reward records currently have no automatic deletion deadline; the 30-day claim window is not a retention limit. Unity may process data outside your country. See [Unity's Privacy Policy](https://unity.com/legal/privacy-policy).

### WeChat: CloudBase leaderboards and player cards

The WeChat Mini Game leaderboard uses native WeChat cloud calls and Tencent CloudBase. The server derives an in-game player identifier from the OpenID supplied by WeChat. It stores daily points, challenge times, board dates, score achievement times and reward delivery acknowledgements. Other players can see your game profile, rank and score or time, but not your raw OpenID or reward receipts.

You may keep the default cat name and avatar or choose a game nickname and a preset avatar. This does not read your WeChat nickname, profile photo, friend relationships, contacts or phone number, and does not upload photographs. Submitted nicknames and the WeChat identifier needed by the service are sent to WeChat's text safety service for review before publication. Avoid placing private contact details in a public nickname.

The complete game save, boards, check-ins, collection and hint wallet stay on the device. Cross-device save or wallet recovery is not provided. The 30-day reward claim window is not a data deletion deadline; boards and reward receipts currently have no uniform automatic deletion deadline. Uninstalling or clearing local data does not automatically delete cloud records. For access, correction or deletion requests, contact dawenhing+support@gmail.com with the platform, public player number and relevant dates; do not send authentication tokens. We verify ownership before handling records. Choosing to copy the support email in Settings writes that email to the clipboard and does not read its previous content.

This addendum describes the WeChat CloudBase leaderboard only. iOS continues to use Unity under the existing policy. The iOS advertising, analytics, purchase and notification SDK statements do not mean the same SDKs are enabled in the WeChat version. Future advertising changes require an update reflecting the actual data practices.

The service also keeps limited request counters and maintenance records for rate limiting, settlement and troubleshooting. Tencent/WeChat process the network information needed to provide the service. See [Tencent Cloud Privacy Statement](https://cloud.tencent.com/document/product/301/11470).

### iOS advertising and consent

Meowtrix uses Google AdMob to display banner ads, full-screen ads between levels, and optional rewarded video ads that you choose to watch for a hint. Google's advertising SDK may process IP addresses (including an approximate location inferred from them), device identifiers, ad interactions, and diagnostic or performance information to provide advertising, measurement, and fraud prevention. Collection depends on platform, permissions, consent, and SDK configuration. Meowtrix does not request GPS location access.

Google's User Messaging Platform manages consent where applicable. When available, use **Privacy Settings** in the game's settings to review or change your choices. On iOS, tracking permission is controlled in system settings; denying tracking does not prevent gameplay. These choices do not necessarily stop all advertising-related data processing.

### iOS usage analytics and shared web pages

Meowtrix uses Google Analytics for Firebase to understand how the game is played, for example which levels are started and completed and when hints are used. This data is tied to an app-instance identifier generated by Google, not to your name, email address, or an account. Analytics is off by default and is turned on only after the consent flow described above has finished and permits it. Where a consent choice is offered, declining it, or later changing it in **Privacy Settings**, turns analytics off. Google retains analytics data according to its policies and this project's Analytics settings.

See [Google's Privacy Policy](https://policies.google.com/privacy) and [How Google uses information from apps that use its services](https://policies.google.com/technologies/partner-sites).

The puzzle pages that a shared link opens in a web browser (under dourgulf.github.io/meowtrix/play/) also use Google Analytics. They record that a page was opened, whether the puzzle was started and solved, and whether the App Store button was pressed. Google Analytics sets cookies in your browser for this. If your browser's time zone is in Europe, the page asks first and records nothing unless you choose **Allow**. Your answer is kept in your browser's local storage; clearing the site's data makes the page ask again.

### Subscriptions and purchases

On iOS, Meowtrix Plus is an optional auto-renewable subscription bought through Apple's App Store. Apple handles purchases, renewals, and refunds; Meowtrix never receives your payment details. Your subscription status and hint balance are stored on your device. If analytics is on, the app records purchase-flow analytics events, such as the plan chosen, the price shown, and whether the purchase finished or was cancelled. These events are associated with the app-instance identifier described above, but contain no payment details and no App Store transaction identifiers. See [Apple's Privacy Policy](https://www.apple.com/legal/privacy/).

### iOS crash reports

Meowtrix uses Firebase Crashlytics to find and fix problems. When the app crashes or hits certain errors, such as saved progress that cannot be read or saved, it sends a report with the error and where in the code it happened, the device model, operating-system and app versions, and an identifier for the installation. Reports do not include your saved game or other personal content. Crash reporting follows the same consent as analytics: it is off by default and is turned on only when the consent flow permits it.

### iOS notifications

If you allow notifications, Meowtrix schedules a daily check-in reminder on your device. The reminder is a local notification: it is not sent from a server, and the app does not collect a push token. You can turn it off in your system settings at any time.

### Storage, requests, and contact

Local game data remains on the device until removed or overwritten; operating-system backups may retain copies. Google handles advertising, analytics, and crash-report data under its policies, including retention and processing locations. Removing the app or clearing local data does not automatically delete Unity or CloudBase records. To request access, correction or deletion, contact us with your platform, public player number from the leaderboard, and relevant dates; do not send authentication tokens. We may need more information to verify an anonymous record, and removing local data may prevent verification. For privacy questions or requests, contact the developer at the email above. If you email us, including through **Send Feedback** in the game's settings, your message and address are used to respond to your request.

### Audience

Meowtrix is intended for a general audience and is not directed specifically to children. If you believe a child has provided personal information through the app or a support request, contact us using the email above.

### Changes

We will update this policy when the app's data practices change and revise its effective date.

## 简体中文

本政策区分 iOS、微信小游戏及分享题目网页。iOS 排行榜使用 Unity；微信排行榜使用腾讯云 CloudBase。微信版当前不初始化 iOS 的 AdMob、Firebase 或 Apple 订阅 SDK。iOS 名片编辑保存在本机，其排行榜目前展示生成的猫名及玩家短编号。

### 游戏数据

喵阵（Meowtrix）是一款逻辑解谜游戏，无需注册账号。游戏进度、棋盘状态、教程进度、提示余额、每日签到进度、已收集的插画和偏好设置保存在设备上。完整存档保留在设备上；部分排行榜及奖励记录会按下文说明发送至对应平台的服务。设备备份与恢复可能由操作系统管理。

### iOS：Unity 排行榜与奖励

喵阵使用 Unity Authentication、Leaderboards、Cloud Code 和 Cloud Save。游戏自动建立匿名玩家 ID，并在设备上保存会话令牌以保持身份；Unity 会处理这些服务的 IP 地址。排行榜属于游戏功能，与可选的广告和统计同意设置分开；排行榜 ID 不用于广告追踪。

每日积分、挑战完成耗时及榜单日期会发送至 Unity。其他玩家可以看到排名、积分或耗时，以及生成的猫咪名字和玩家短编号。奖励记录包含玩家 ID、榜期、名次、提示数量及送达确认，用于防止重复发放。完整棋盘存档和提示余额不会备份至 Unity；该功能不提供跨设备存档恢复。

日期挑战榜计划在超过 35 天后删除。积分归档和奖励记录目前没有自动删除期限；30 天补领期限不等于数据保留期限。Unity 可能在你所在国家之外处理数据。详见 [Unity 隐私政策](https://unity.com/legal/privacy-policy)。

### 微信：CloudBase 排行榜与玩家名片

微信小游戏版的排行榜使用微信原生云调用和腾讯云 CloudBase。为识别你的成绩和奖励归属，服务端使用微信提供的 OpenID 生成游戏内玩家标识。每日积分、挑战完成耗时、榜单日期、达到成绩的时间，以及奖励发放和确认记录保存在云端。其他玩家可以看到你的游戏名片、排名、积分或挑战耗时，不能看到原始 OpenID 或奖励回执。

你可以直接使用默认猫名和头像，也可以主动设置游戏昵称和预设头像。我们不会为此读取你的微信昵称、微信头像、朋友关系、通讯录或手机号，也不会上传照片。你提交的昵称会连同服务所需的微信用户标识交由微信文本安全接口审核，通过后用于公开名片。请勿在公开昵称中填写手机号等私人信息。

完整游戏存档、棋盘、签到、收藏和提示余额保存在设备上；排行榜不提供跨设备存档或钱包恢复。30 天是新领积分排行奖励的期限，不是数据自动删除期限，目前榜单和回执没有统一自动删除期限。卸载或清理本地数据不会自动删除云端记录。查询、更正或删除相关记录，请联系 `dawenhing+support@gmail.com`，说明平台、排行短编号和相关日期；我们会核实记录归属，请勿发送认证令牌。设置中的复制邮箱操作只会在你主动选择时将联系邮箱写入剪贴板，不读取已有内容。

上述内容仅描述微信 CloudBase 排行榜。iOS 版继续按现有政策使用 Unity；iOS 的广告、统计、购买和通知说明不能推定为微信版当前启用了相同 SDK。未来微信广告功能启用前，会按实际处理方式更新相关说明。

服务端还保存基本请求计数和维护记录，用于限流、结算及故障排查；腾讯云和微信处理提供网络服务所需的连接信息。详见[腾讯云隐私保护声明](https://cloud.tencent.com/document/product/301/11470)。

### iOS 广告与同意

喵阵使用 Google AdMob 展示横幅广告、关卡之间的全屏广告，以及你主动选择观看以获得提示的激励视频广告。Google 广告 SDK 可能处理 IP 地址（包括由此推断的大致位置）、设备标识符、广告互动、诊断或性能信息，用于广告展示、效果衡量和防止欺诈。实际收集取决于平台、权限、同意选择及 SDK 配置。喵阵不请求 GPS 定位权限。

适用时，Google 用户消息平台管理同意选择。在游戏设置中出现「隐私设置」时，你可以打开它查看或更改选择。iOS 追踪权限可在系统设置中管理，拒绝追踪不影响游玩。这些选择不一定停止所有与广告有关的数据处理。

### iOS 使用统计与分享网页

喵阵使用 Google Analytics for Firebase 了解游戏的使用情况，例如开始和完成了哪些关卡、何时使用提示。这些数据关联的是 Google 生成的应用实例标识符，不关联你的姓名、邮箱或账号。统计默认关闭，只有在上述同意流程完成并允许后才开启。在提供同意选择的地区，拒绝同意，或之后在「隐私设置」中更改选择，都会关闭统计。Google 根据其政策和本项目的 Analytics 设置保留统计数据。

详情见 [Google 隐私政策](https://policies.google.com/privacy?hl=zh-CN)及 [Google 如何使用接入其服务的应用所提供的信息](https://policies.google.com/technologies/partner-sites?hl=zh-CN)。

通过分享链接在浏览器中打开的网页版题目（位于 dourgulf.github.io/meowtrix/play/）也使用 Google Analytics，记录页面是否被打开、题目是否开始和完成，以及是否点击了 App Store 按钮。为此 Google Analytics 会在你的浏览器中写入 cookie。如果浏览器的时区在欧洲，页面会先询问，只有你选择**「允许」**后才会记录。你的选择保存在浏览器的本地存储中；清除该网站的数据后，页面会再次询问。

### 订阅与购买

在 iOS 上，喵阵 Plus 是通过 Apple App Store 购买的可选自动续期订阅。购买、续订和退款由 Apple 处理，喵阵不会收到你的付款资料。订阅状态和提示余额保存在你的设备上。统计开启时，应用会记录购买流程分析事件，例如所选套餐、展示的价格，以及购买是完成还是取消。这些事件与上述应用实例标识符关联，但不含付款资料，也不含 App Store 交易标识。详情见 [Apple 隐私政策](https://www.apple.com/legal/privacy/zh-cn/)。

### iOS 崩溃报告

喵阵使用 Firebase Crashlytics 发现和修复问题。应用崩溃或遇到某些错误（例如存档读不出或写不进）时，会发送一份报告，内容包括错误及其在代码中的位置、设备型号、系统与应用版本，以及这次安装的标识符。报告不包含你的游戏存档或其他个人内容。崩溃报告与使用统计遵循同一个同意选择：默认关闭，只有同意流程允许后才开启。

### iOS 通知

如果你允许通知，喵阵会在你的设备上安排每日签到提醒。提醒是本地通知：不由服务器发送，应用也不收集推送令牌。你可以随时在系统设置中关闭。

### 保存、请求与联系

本地游戏数据会保留至被移除或覆盖；操作系统备份中可能仍有副本。Google 根据其政策管理广告、统计和崩溃报告数据，包括保存期限和处理地点。卸载应用或清理本地数据不会自动删除 Unity 或 CloudBase 记录。查询、更正或删除请求请提供平台、排行榜中的玩家短编号及相关日期，请勿发送认证令牌。我们可能需要进一步核实匿名记录；清除本地数据可能导致无法确认归属。如有隐私问题或相关请求，请通过上方邮箱联系开发者。你发送邮件时（包括通过游戏设置中的「意见反馈」），邮件内容和地址用于回复该请求。

### 受众

喵阵面向一般受众，并非专门面向儿童。如你认为儿童通过本应用或支持请求提供了个人信息，请通过上方邮箱联系我们。

### 政策更新

应用的数据处理方式变化时，我们会更新本政策及生效日期。

## 日本語

本ポリシーは iOS、WeChat ミニゲーム、共有パズルのウェブページを区別します。iOS のランキングは Unity、WeChat は Tencent CloudBase を利用します。WeChat 版は現在、iOS の AdMob、Firebase、Apple サブスクリプション SDK を初期化しません。iOS のプレイヤーカード編集は端末内に保存され、ランキングには現在、自動生成された猫の名前と公開プレイヤー番号が表示されます。

### ゲームデータ

Meowtrix（ニャトリックス、以下「本アプリ」）は、アカウント登録なしで遊べるロジックパズルゲームです。ゲームの進行状況、盤面の状態、チュートリアルの進行状況、ヒントの残り回数、デイリーチェックインの達成状況、獲得したイラスト、各種設定は、ご利用の端末に保存されます。完全なセーブデータは端末に保存されますが、下記のランキングと報酬の記録は、各プラットフォームのサービスに送信されます。端末のバックアップや復元は、OS の機能によって行われる場合があります。

### iOS：Unity のランキングと報酬

本アプリは Unity Authentication、Leaderboards、Cloud Code、Cloud Save を利用します。匿名プレイヤー ID が自動作成され、継続利用のためのセッショントークンが端末に保存されます。Unity は各サービスで IP アドレスを処理します。ランキングはゲーム機能であり、任意の広告・分析への同意とは別の処理です。ランキング ID は広告トラッキングに使用しません。

日別ポイント、チャレンジのクリア時間、ランキングの日付を Unity に送信します。他のプレイヤーには順位、スコアや時間、自動生成された猫の名前とプレイヤー番号が表示されます。重複付与防止の報酬記録には ID、期間、順位、ヒント数、配信確認が含まれます。完全な盤面セーブやヒント残高は Unity にバックアップされず、端末間のセーブ復元は提供しません。

日付別チャレンジのランキングは 35 日を超えた後に削除する予定です。ポイントアーカイブと報酬記録には現在、自動削除期限を設定していません。30 日間の受取期限はデータ保管期限ではありません。データは居住国外で処理される場合があります。[Unity のプライバシーポリシー](https://unity.com/legal/privacy-policy)をご確認ください。

### WeChat：CloudBase のランキングとプレイヤーカード

WeChat ミニゲーム版のランキングは、WeChat のネイティブクラウド呼び出しと Tencent CloudBase を利用します。サーバーは WeChat が提供する OpenID からゲーム内プレイヤー ID を生成し、日別ポイント、チャレンジのクリア時間、対象日、成績の達成時刻、報酬の配信・確認記録を保存します。他のプレイヤーにはゲーム内プロフィール、順位、スコアや時間が表示されますが、元の OpenID や報酬の受領記録は公開されません。

初期の猫の名前・アバターのまま遊ぶことも、ゲーム内ニックネームと用意されたアバターを選ぶこともできます。この機能は WeChat アカウントのニックネーム、顔写真、友達関係、連絡先、電話番号を取得せず、写真もアップロードしません。入力したニックネームと審査に必要な WeChat ユーザー識別子は、公開前に WeChat のテキスト安全性確認サービスへ送信されます。公開ニックネームに私的な連絡先を記載しないでください。

完全なセーブデータ、盤面、チェックイン、コレクション、ヒント残高は端末に保存され、端末間のセーブ・残高復元は提供しません。30 日間の報酬受取期限はデータ削除期限ではなく、ランキングと受領記録には現在、統一された自動削除期限がありません。アプリの削除や端末内データの消去では、クラウド記録は自動削除されません。照会・訂正・削除については、プラットフォーム、公開プレイヤー番号、対象日を添えて dawenhing+support@gmail.com までご連絡ください。認証トークンは送らないでください。記録の帰属を確認したうえで対応します。設定でメールアドレスのコピーを選ぶと、連絡先メールのみをクリップボードへ書き込み、元の内容は読み取りません。

この追記は WeChat CloudBase ランキングのみを対象とし、iOS 版は既存の方針に従い Unity を利用します。iOS の広告・分析・購入・通知 SDK に関する説明は、WeChat 版で同じ SDK を有効にしていることを意味しません。今後広告を導入する場合は、実際の処理内容に合わせて説明を更新します。

基本的なリクエスト回数と保守記録を、呼び出し制限、精算、障害調査に利用します。Tencent と WeChat はサービス提供に必要な通信情報を処理します。[Tencent Cloud のプライバシー声明](https://cloud.tencent.com/document/product/301/11470)をご確認ください。

### iOS の広告配信と同意の管理

本アプリでは、Google AdMob を利用して、バナー広告、レベルの合間に表示される全画面広告、ヒントを獲得するために任意で視聴できる動画リワード広告を配信します。Google の広告 SDK は、広告配信、効果測定、不正行為の防止を目的として、IP アドレス（IP アドレスから推定されるおおよその位置情報を含みます）、端末の識別子、広告の表示・操作に関する情報、診断情報、パフォーマンス情報を処理する場合があります。実際に収集される情報は、ご利用のプラットフォーム、権限の設定、同意の内容、SDK の設定によって異なります。本アプリが GPS による位置情報へのアクセス許可を求めることはありません。

同意の確認が必要な地域では、Google の User Messaging Platform（UMP）を利用して、同意の取得・管理を行います。ゲーム内の設定画面に「プライバシー設定」が表示されている場合は、そこから同意内容を確認・変更できます。iOS では、端末の設定でトラッキングの許可を管理できます。トラッキングを許可しなくても、ゲームをプレイできます。ただし、これらの設定によって、広告に関するすべてのデータ処理が停止するわけではありません。

### iOS の利用状況の分析と共有ウェブページ

本アプリでは、Google Analytics for Firebase を利用して、レベルの開始・クリア、ヒントの使用など、ゲームの利用状況を分析します。分析データは、Google が生成するアプリ インスタンス ID（アプリのインストールごとに割り当てられる識別子）に関連付けられます。本アプリでは、このデータを利用者の氏名、メールアドレス、アカウントに関連付けることはありません。

分析データの収集は初期設定では無効です。上記の同意確認の結果に基づき、収集が認められる場合に有効になります。同意の選択肢が提示される地域では、分析に必要な同意をしなかった場合、または後から「プライバシー設定」で同意を撤回した場合、分析データの収集・送信を停止します。同意の取得が不要な地域では、同意要否の確認が完了した後に収集を開始します。Google は、同社のポリシーおよび本アプリの Google Analytics の設定に従って、分析データを保管します。

詳しくは、[Google のプライバシーポリシー](https://policies.google.com/privacy?hl=ja)および [Google のサービスを使用するサイトやアプリから収集した情報の Google による使用](https://policies.google.com/technologies/partner-sites?hl=ja)をご覧ください。

共有リンクからウェブブラウザで開くパズルのページ（dourgulf.github.io/meowtrix/play/ 以下）でも、Google Analytics を利用します。ページが開かれたこと、パズルを開始・クリアしたかどうか、App Store ボタンが押されたかどうかを記録します。このために、Google Analytics はご利用のブラウザに Cookie を保存します。ブラウザのタイムゾーンがヨーロッパの場合は、ページ上で事前に確認を行い、**「許可」**を選択した場合にのみ記録します。選択の内容はブラウザのローカルストレージに保存されます。このサイトのデータを消去すると、次回あらためて確認を行います。

### サブスクリプションと購入

iOS 版では、Apple の App Store を通じて、有料の自動更新サブスクリプション「Meowtrix Plus」に任意でご加入いただけます。購入、契約の更新、返金の手続きは Apple が行います。本アプリがクレジットカード番号などの決済情報を取得することはありません。サブスクリプションの契約状況とヒントの残り回数は、ご利用の端末に保存されます。

利用状況の分析が有効な場合は、選択したプラン、表示価格、購入手続きの結果（完了・キャンセルなど）を分析データとして記録します。これらのデータは、上記のアプリ インスタンス ID に関連付けられますが、クレジットカード番号などの決済情報や、App Store の取引識別子は含まれません。詳しくは、[Apple のプライバシーポリシー](https://www.apple.com/legal/privacy/jp/)をご覧ください。

### iOS のクラッシュレポート

本アプリでは、不具合の発見と修正のために Firebase Crashlytics を利用します。アプリがクラッシュした場合や、セーブデータの読み込み・保存に失敗した場合などの特定のエラーが起きた場合に、エラーの内容とコード上の発生箇所、端末の機種、OS とアプリのバージョン、インストールごとの識別子を含むレポートを送信します。レポートには、セーブデータやその他の個人的な内容は含まれません。クラッシュレポートは利用状況の分析と同じ同意に従います。初期設定では無効で、同意確認の結果に基づき認められる場合にのみ有効になります。

### iOS 通知

通知を許可した場合は、デイリーチェックインをお知らせするリマインダーを端末内で設定します。このリマインダーは、端末上で表示されるローカル通知です。サーバーから配信されるものではなく、本アプリがプッシュ通知用のトークンを収集することもありません。通知は、端末の設定からいつでも無効にできます。

### データの保存とお問い合わせ

端末内のゲームデータは、削除または上書きされるまで保存されます。OS のバックアップにデータのコピーが残る場合があります。広告配信、利用状況の分析、クラッシュレポートに関するデータは、保存期間や処理が行われる場所も含め、Google が同社のポリシーに従って取り扱います。アプリの削除や端末内データの消去だけでは Unity や CloudBase 上の記録は削除されません。照会・訂正・削除の依頼には、プラットフォーム、ランキング上のプレイヤー番号、対象日付をお知らせください。認証トークンは送らないでください。匿名記録の確認には追加情報が必要な場合があり、端末内データの消去後は確認できない場合があります。

プライバシーに関するご質問や、データの取り扱いに関するご要望は、冒頭に記載のメールアドレスまでご連絡ください。メールでお問い合わせいただいた場合（ゲーム内の設定画面にある「フィードバックを送る」からの送信を含みます）、メールの内容と送信元のメールアドレスを、お問い合わせへの対応に使用します。

### お子様のプライバシー

本アプリは一般の利用者向けのゲームであり、お子様を主な対象としたものではありません。お子様が本アプリの利用やお問い合わせを通じて個人情報を提供した可能性がある場合は、冒頭に記載のメールアドレスまでご連絡ください。

### 本ポリシーの変更

本アプリにおけるデータの取り扱いに変更があった場合は、本ポリシーを改定し、適用開始日を更新します。
