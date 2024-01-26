import { EditorState } from 'draft-js'
import { useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const Appeal = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const onEditorStateChange = (newState: EditorState) => {
    setEditorState(newState)
  }
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-10 lg:px-20">
      <div className="text-2xl font-bold">신문고</div>
      <p className="my-5">
        대한미식축구협회는 각종 비윤리 및 불법, 부조리행위 등을 근절하기 위해
        노력하고 있습니다. 본 공간은 미식축구 관련 비위행위 및 각종 민원 사항을
        접수받고 상담하는 공간으로, 접수된 민원은 아래와같은 절차에 따라 처리 후
        답변드립니다. KAFA신문고센터는 신고 내용에 따라 총 3가지 분야로 나누어
        운영되며, 성폭력/성희롱 및 미식축구부 부조리 신고센터는 그 성격상 일반
        민원과는 별도로 분리 운영 되오니 해당 내용은 그 분야에 맞게 신고해
        주시기 바랍니다. 아울러, 신고내용 및 민원/신고인의 개인정보는 관계법령에
        따라 보호됨을 알려드립니다.
      </p>
      <hr className="border-gray-400" />
      <div className="mt-5 text-2xl font-bold">신고 방법 및 진행 절차</div>
      <div className="mt-5 text-xl font-bold">신고 방법</div>
      <div>∙ 본 페이지 하단 신고하기 메뉴 중 신고 내용 해당 분야 클릭</div>
      <div>∙ 신고 페이지 상에서 신고인 기초정보 및 신고 내용 입력</div>
      <div className="mt-5 text-xl font-bold">신고 내용</div>
      <p className="mb-5">
        신고 시 신고대상, 신고내용(장소, 부조리행위, 피해내용), 기타 관계자 등에
        대해 6하 원칙에 따라 구체적으로 작성, 신고 내용을 증빙할 수 있는 자료
        일체 첨부
      </p>
      <div className="text-xl font-bold">진행 절차</div>
      <div>∙ 신고접수</div>
      <div>∙ 신고내용 확인</div>
      <div>∙ 추가 조사, 조치</div>
      <div>∙ 처리결과 회신</div>
      <hr className="mt-5 border-gray-400" />
      <div className="my-5 text-2xl font-bold">신고 하기</div>
      <div className="mb-5 border border-gray-400 bg-white">
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="px-4 h-44"
          placeholder="내용을 작성해주세요."
          localization={{
            locale: 'ko'
          }}
          onEditorStateChange={onEditorStateChange}
        />
      </div>
      <div className="mb-5 text-2xl font-bold">
        개인정보 수집/이용 및 제3자 제공 동의서
      </div>

      <div className="overflow-y-auto border border-gray-400 bg-white p-4">
        <div className="h-28 text-sm text-gray-500">
          <p>개인정보 수집・이용 및 제3자 제공 동의서</p>
          <p>
            신고와 관련하여 「개인정보보호법」제15조(개인정보의 수집ㆍ이용) 및
            제22조에 따라 귀하의 개인정보를 아래와 같이 수집・이용 및 제3자
            제공을 하고자 합니다.
          </p>
          <p>
            다음의 사항에 대해 충분히 읽어보신 후, 동의 여부를 체크, 서명하여
            주시기 바랍니다.
          </p>
          <p>1. 개인정보 수집 및 이용 동의 [필수]</p>
          [수집・이용하려는 개인정보의 항목] <br />
          ・개인식별정보(성명, 성별, 생년월일, 주소, 연락처, e-mail 주소, 소속,
          소속경력, 활동여부, 신상사항, 기타 증거 및 증빙자료에 표기된 개인정보
          등) <br />
          ・(필요시) 가족사항, 관계자(피해자, 피신고인, 참고인 등) 정보(성명,
          생년월일, 연락처, 소속, 직책, 관계, 사진, 동영상, 은행정보, 기타 증거
          및 증빙자료에 표기된 개인정보 등) 등 <br />
          [개인정보의 수집・이용 목적] <br />
          ・사실관계 및 신고내용 파악∙조사 ・신고건 관리, 피해자 보호(사전 조치
          및 2차 피해 방지 조치 등), 치료∙상담, 대책 마련, 징계 상정, 징계범위
          확대, 수사기관 신고 등 [개인정보 이용 및 보유기간] <br />
          ・5년 <br />
          ※ 귀하께서는 개인정보 제공 및 활용에 거부할 권리가 있습니다.
          <br />○ 거부에 따른 불이익 : 위 제공사항은 신고에 반드시 필요한
          사항으로 거부하실 경우 신고사항에 대한 조사 및 관련 조치 등이
          불가능하거나 제한될 수 있음을 알려드립니다. <br />
          2. 개인정보의 제3자 제공 동의 [필수] <br />
          [제공되는 개인정보 항목] ・개인식별정보 등 위 1.에 명시된 개인정보
          항목 <br />
          [개인정보를 제공 받는 자] 수사기관, 조사의뢰기관, 상담기관, 의료기관,
          대한미식축구협회, 교육청, 정부부처 등을 포함하여 해당 신고사항을
          관할하는 징계 및 조치 처리/담당기관, 언론사 등 <br />
          [개인정보를 제공 받는 자의 개인정보 이용목적] <br />
          ・신고건 관리, 조사, 수사, 피해자 보호(사전 조치 및 2차 피해 방지 조치
          등), 치료∙상담, 징계, 징계범위 확대, 취재협조를 위한 제공 등 <br />
          [개인정보를 제공 받는 자의 개인정보 이용 및 보유기간] <br />
          ・5년 <br />
          ※ 귀하께서는 개인정보 제공 및 활용에 거부할 권리가 있습니다. <br />○
          거부에 따른 불이익 : 위 제공사항은 신고사항에 대한 조사, 수사, 피해자
          보호 및 징계 등에 반드시 필요한 사항으로 거부하실 경우 신고사항에 대한
          지원이 불가능하거나 제한될 수 있음을 알려드립니다.
        </div>
      </div>
      <div className="border border-x-gray-400 bg-white p-4 text-sm text-gray-500">
        <div className="flex justify-between">
          <div>
            본인은 위와 같이 개인정보를 수집/이용하고 제3자에게 제공하는데
            동의하십니까?
          </div>
          <div>
            <button>동의</button>
          </div>
        </div>
      </div>
      <div className="mb-5 border border-gray-400 bg-white p-4 text-sm text-gray-500">
        <div className="flex justify-between">
          <div>
            정보주체가 만 14세 미만의 아동인 경우 위와 같이 개인정보를
            수집/이용하고 제3자에게 제공하는데 동의하십니까?
          </div>
          <div>
            <button>동의</button>
          </div>
        </div>
      </div>
      <div className="text-center">
        <button>등록하기</button>
      </div>
      <div className="mb-5 mt-3 text-center">
        <button>취소</button>
      </div>
    </div>
  )
}

export default Appeal
