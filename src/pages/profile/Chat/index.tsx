import {Input, NavBar} from 'antd-mobile'
import classnames from 'classnames'
import {useHistory} from 'react-router-dom'
import Icon from '@/components/icon'
import styles from './index.module.scss'
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/types/store";
import io from 'socket.io-client'

type Chat = {
    type: 'xz' | 'user' //区分聊天人
    msg: string //聊天内容
}
const Chats = () => {
    const history = useHistory()
    //1.小智聊天列表数据
    const [chatList, setChatList] = useState<Chat[]>([])
    const {photo} = useSelector((state: RootState) => state.profile.user)
    const {token} = useSelector((state: RootState) => state.login)
    //2.建立ws链接，得到ws实例
    useEffect(() => {
        // 1 建立连接
        const ws = io('http://toutiao.itheima.net', {
            // 参数
            query: {
                token
            },
            // 连接方式
            transports: ['websocket']
        })
        ws.on('connect', () => {
            console.log('建立成功!')
            setChatList((chatList) => [...chatList, {type: 'xz', msg: '你好！'}, {type: 'xz', msg: '有什么可以帮助您？'}])

            // ws.emit('message', {
            //     msg: '你好',
            //     timestamp: Date.now()
            // })
        })
    }, [token])

    return (
        <div className={styles.root}>
            <NavBar className="fixed-header" onBack={() => history.go(-1)}>
                小智同学
            </NavBar>
            {/*小智聊天列表*/}
            <div className="chat-list">
                {/*self时小智的类名，user是用户类名*/}
                {
                    chatList.map((item, i) => (
                        <div key={i} className={classnames('chat-item', item.type === 'xz' ? 'self' : 'user')}>
                            {item.type === 'xz' ? (
                                <Icon type="iconbtn_xiaozhitongxue"/>
                            ) : (
                                <img src={photo || 'http://geek.itheima.net/images/user_head.jpg'} alt=""/>
                            )}
                            {/*聊天内容*/}
                            <div className="message">{item.msg}</div>
                        </div>
                    ))
                }
            </div>
            {/*聊天发送区域-输入框*/}
            <div className="input-footer">
                <Input className="no-border" placeholder="请描述您的问题"/>
                <Icon type="iconbianji"/>
            </div>
        </div>
    )
}

export default Chats
