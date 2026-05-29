import imgLogoImage from "figma:asset/9f2b02a70d969501a98e759282b75e264fcf1f41.png";

function Client() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col gap-[11.402px] items-start justify-start leading-[0] left-[42.756px] not-italic overflow-clip p-0 text-[#121722] text-left top-[148.222px] w-[324.948px]"
      data-name="Client"
    >
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[19.9529px] w-full">
        <p className="block leading-[normal]">Client Name</p>
      </div>
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[14.2521px] w-full">
        <p className="block leading-[normal]">Address / Contact Info</p>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="absolute h-[18.528px] left-[42.756px] top-[427.563px] w-[762.487px]" />
  );
}

function InvoiceNumber() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[5.701px] items-end justify-start leading-[0] not-italic p-0 relative shrink-0 text-nowrap text-right"
      data-name="Invoice Number"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#60737d] text-[14.2521px]">
        <p className="block leading-[normal] text-nowrap whitespace-pre">
          Invoice No.
        </p>
      </div>
      <div className="font-['Inter:Bold',_sans-serif] font-bold relative shrink-0 text-[#121722] text-[18.5277px]">
        <p className="block leading-[normal] text-nowrap whitespace-pre">
          #00001
        </p>
      </div>
    </div>
  );
}

function IssuedOnDate() {
  return (
    <div
      className="box-border content-stretch flex flex-col font-['Inter:Regular',_sans-serif] font-normal gap-[2.85px] items-end justify-start leading-[0] not-italic p-0 relative shrink-0 text-[14.2521px] text-nowrap text-right"
      data-name="Issued on Date"
    >
      <div className="relative shrink-0 text-[#60737d]">
        <p className="block leading-[normal] text-nowrap whitespace-pre">
          Issued on
        </p>
      </div>
      <div className="relative shrink-0 text-[#121722]">
        <p className="block leading-[normal] text-nowrap whitespace-pre">
          December 7, 2022.
        </p>
      </div>
    </div>
  );
}

function PaymentDueDate() {
  return (
    <div
      className="box-border content-stretch flex flex-col font-['Inter:Regular',_sans-serif] font-normal gap-[2.85px] items-end justify-start leading-[0] not-italic p-0 relative shrink-0 text-[14.2521px] text-nowrap text-right"
      data-name="Payment Due Date"
    >
      <div className="relative shrink-0 text-[#60737d]">
        <p className="block leading-[normal] text-nowrap whitespace-pre">
          Payment Due
        </p>
      </div>
      <div className="relative shrink-0 text-[#121722]">
        <p className="block leading-[normal] text-nowrap whitespace-pre">
          December 22, 2022.
        </p>
      </div>
    </div>
  );
}

function Dates() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[17.102px] items-end justify-start p-0 relative shrink-0"
      data-name="Dates"
    >
      <IssuedOnDate />
      <PaymentDueDate />
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute box-border content-stretch flex flex-col h-[190.978px] items-end justify-between p-0 right-[42.756px] top-[42.756px]">
      <InvoiceNumber />
      <Dates />
    </div>
  );
}

function InvoiceItem1() {
  return (
    <div
      className="box-border content-stretch flex flex-row font-['Inter:Regular',_sans-serif] font-normal items-center justify-between leading-[0] not-italic p-0 relative shrink-0 text-[15.6773px] w-[762.487px]"
      data-name="Invoice Item 1"
    >
      <div className="relative shrink-0 text-[#121722] text-left w-[356.303px]">
        <p className="block leading-[normal]">Invoice Item 1</p>
      </div>
      <div className="relative shrink-0 text-[#60737d] text-right w-[42.756px]">
        <p className="block leading-[normal]">1</p>
      </div>
      <div className="relative shrink-0 text-[#60737d] text-right w-[128.269px]">
        <p className="block leading-[normal]">4,000.00</p>
      </div>
      <div className="relative shrink-0 text-[#121722] text-right w-[128.269px]">
        <p className="block leading-[normal]">4,000.00</p>
      </div>
    </div>
  );
}

function InvoiceItem2() {
  return (
    <div
      className="box-border content-stretch flex flex-row font-['Inter:Regular',_sans-serif] font-normal items-center justify-between leading-[0] not-italic p-0 relative shrink-0 text-[15.6773px] w-[762.487px]"
      data-name="Invoice Item 2"
    >
      <div className="relative shrink-0 text-[#121722] text-left w-[356.303px]">
        <p className="block leading-[normal]">Invoice Item 2</p>
      </div>
      <div className="relative shrink-0 text-[#60737d] text-right w-[42.756px]">
        <p className="block leading-[normal]">1</p>
      </div>
      <div className="relative shrink-0 text-[#60737d] text-right w-[128.269px]">
        <p className="block leading-[normal]">4,000.00</p>
      </div>
      <div className="relative shrink-0 text-[#121722] text-right w-[128.269px]">
        <p className="block leading-[normal]">4,000.00</p>
      </div>
    </div>
  );
}

function InvoiceItem3() {
  return (
    <div
      className="box-border content-stretch flex flex-row font-['Inter:Regular',_sans-serif] font-normal items-center justify-between leading-[0] not-italic p-0 relative shrink-0 text-[15.6773px] w-[762.487px]"
      data-name="Invoice Item 3"
    >
      <div className="relative shrink-0 text-[#121722] text-left w-[356.303px]">
        <p className="block leading-[normal]">Invoice Item 3</p>
      </div>
      <div className="relative shrink-0 text-[#60737d] text-right w-[42.756px]">
        <p className="block leading-[normal]">1</p>
      </div>
      <div className="relative shrink-0 text-[#60737d] text-right w-[128.269px]">
        <p className="block leading-[normal]">4,000.00</p>
      </div>
      <div className="relative shrink-0 text-[#121722] text-right w-[128.269px]">
        <p className="block leading-[normal]">4,000.00</p>
      </div>
    </div>
  );
}

function InvoiceItems() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col gap-[28.504px] items-start justify-start left-[42.756px] p-0 top-[384.807px]"
      data-name="Invoice Items"
    >
      <InvoiceItem1 />
      <InvoiceItem2 />
      <InvoiceItem3 />
    </div>
  );
}

function Currency() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start p-0 relative shrink-0"
      data-name="Currency"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#121722] text-[14.2521px] text-nowrap text-right">
        <p className="block leading-[normal] whitespace-pre">USD</p>
      </div>
    </div>
  );
}

function Currency1() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-[1.425px] items-center justify-center p-0 relative shrink-0"
      data-name="Currency"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#60737d] text-[14.2521px] text-nowrap text-right">
        <p className="block leading-[normal] whitespace-pre">(</p>
      </div>
      <Currency />
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#60737d] text-[14.2521px] text-nowrap text-right">
        <p className="block leading-[normal] whitespace-pre">)</p>
      </div>
    </div>
  );
}

function Total() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-[5.701px] items-start justify-start p-0 relative shrink-0"
      data-name="Total"
    >
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#60737d] text-[14.2521px] text-nowrap text-right">
        <p className="block leading-[normal] whitespace-pre">Total</p>
      </div>
      <Currency1 />
    </div>
  );
}

function Total1() {
  return (
    <div
      className="absolute bg-[#f2f5f9] box-border content-stretch flex flex-row h-[57.008px] items-center justify-between left-[487.422px] px-[28.504px] py-0 rounded-[17.1025px] top-[695.503px] w-[346.326px]"
      data-name="Total"
    >
      <Total />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#121722] text-[22.8034px] text-nowrap text-right">
        <p className="block leading-[normal] whitespace-pre">4,000.00</p>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div
      className="overflow-clip relative shrink-0 size-[57.008px]"
      data-name="Logo"
    >
      <div
        className="absolute bg-center bg-cover bg-no-repeat inset-0"
        data-name="Logo Image"
        style={{ backgroundImage: `url('${imgLogoImage}')` }}
      />
    </div>
  );
}

function Id1() {
  return (
    <div
      className="box-border content-stretch flex flex-col font-['Inter:Regular',_sans-serif] font-normal gap-[2.85px] items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-[14.2521px] text-nowrap"
      data-name="ID 1"
    >
      <div className="relative shrink-0 text-[#60737d] text-right">
        <p className="block leading-[normal] text-nowrap whitespace-pre">
          ID#1 Label
        </p>
      </div>
      <div className="relative shrink-0 text-[#121722] text-left">
        <p className="block leading-[normal] text-nowrap whitespace-pre">
          1234567890-123
        </p>
      </div>
    </div>
  );
}

function Id2() {
  return (
    <div
      className="box-border content-stretch flex flex-col font-['Inter:Regular',_sans-serif] font-normal gap-[2.85px] items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-[14.2521px] text-nowrap"
      data-name="ID 2"
    >
      <div className="relative shrink-0 text-[#60737d] text-right">
        <p className="block leading-[normal] text-nowrap whitespace-pre">
          ID#2 Label
        </p>
      </div>
      <div className="relative shrink-0 text-[#121722] text-left">
        <p className="block leading-[normal] text-nowrap whitespace-pre">
          ABC-0987654321
        </p>
      </div>
    </div>
  );
}

function CompanyDetails() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-[11.402px] grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Company Details"
    >
      <div
        className="font-['Inter:Bold',_sans-serif] font-bold leading-[0] min-w-full not-italic relative shrink-0 text-[#121722] text-[19.9529px] text-left"
        style={{ width: "min-content" }}
      >
        <p className="block leading-[normal]">Company Name LLC</p>
      </div>
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#121722] text-[14.2521px] text-left text-nowrap">
        <p className="block leading-[normal] whitespace-pre">
          Address / Contact Info
        </p>
      </div>
      <a
        className="[white-space-collapse:collapse] block font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#334bc8] text-[14.2521px] text-left text-nowrap"
        href="mailto:email@company.com"
      >
        <p className="block cursor-pointer leading-[normal] whitespace-pre">
          email@company.com
        </p>
      </a>
      <Id1 />
      <Id2 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="box-border content-stretch flex flex-col font-['Inter:Regular',_sans-serif] font-normal gap-[2.85px] items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-[14.2521px] text-nowrap">
      <div className="relative shrink-0 text-[#60737d] text-right">
        <p className="block leading-[normal] text-nowrap whitespace-pre">
          ID#1 Label
        </p>
      </div>
      <div className="relative shrink-0 text-[#121722] text-left">
        <p className="block leading-[normal] text-nowrap whitespace-pre">
          1234567890-123
        </p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="box-border content-stretch flex flex-col font-['Inter:Regular',_sans-serif] font-normal gap-[2.85px] items-start justify-start leading-[0] not-italic p-0 relative shrink-0 text-[14.2521px] text-nowrap">
      <div className="relative shrink-0 text-[#60737d] text-right">
        <p className="block leading-[normal] text-nowrap whitespace-pre">
          ID#2 Label
        </p>
      </div>
      <div className="relative shrink-0 text-[#121722] text-left">
        <p className="block leading-[normal] text-nowrap whitespace-pre">
          ABC-0987654321
        </p>
      </div>
    </div>
  );
}

function PaymentInstructions() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-[11.402px] grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Payment Instructions"
    >
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#121722] text-[14.2521px] text-left text-nowrap">
        <p className="block leading-[normal] whitespace-pre">
          Payment Instructions
        </p>
      </div>
      <div
        className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] min-w-full not-italic relative shrink-0 text-[#60737d] text-[14.2521px] text-left"
        style={{ width: "min-content" }}
      >
        <p className="block leading-[normal]">
          Voluptas nisi aut. Est vitae dolore molestias porro praesentium.
          Tempore recusandae voluptatem necessitatibus corporis inventore neque
          magnam ut.
        </p>
      </div>
      <Frame2 />
      <Frame6 />
    </div>
  );
}

function AdditionalNotes() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-[11.402px] grow items-start justify-start leading-[0] min-h-px min-w-px not-italic p-0 relative shrink-0 text-[14.2521px] text-left text-nowrap"
      data-name="Additional Notes"
    >
      <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[#121722]">
        <p className="block leading-[normal] text-nowrap whitespace-pre">
          Additional Notes
        </p>
      </div>
      <div className="font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#60737d]">
        <p className="block leading-[normal] text-nowrap whitespace-pre">
          Have a great day
        </p>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="box-border content-stretch flex flex-row gap-[17.102px] items-start justify-start p-0 relative shrink-0 w-full">
      <CompanyDetails />
      <PaymentInstructions />
      <AdditionalNotes />
    </div>
  );
}

function Company() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col gap-[17.102px] items-start justify-start left-[42.756px] overflow-clip p-0 top-[809.519px] w-[762.487px]"
      data-name="Company"
    >
      <Logo />
      <Frame14 />
    </div>
  );
}

export default function Invoice() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-[31.3546px] size-full"
      data-name="Invoice"
    >
      <div className="overflow-clip relative size-full">
        <div className="absolute bg-[#f2f5f9] h-[247.987px] left-[14.252px] rounded-[17.1025px] top-[14.252px] w-[819.496px]" />
        <div className="absolute bg-[#f2f5f9] h-[1.425px] left-[14.252px] rounded-[2.85042px] top-[724.007px] w-[819.496px]" />
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[103.756px] not-italic text-[#60737d] text-[14.2521px] text-nowrap text-right top-[119.718px] translate-x-[-100%]">
          <p className="block leading-[normal] whitespace-pre">Billed To:</p>
        </div>
        <Client />
        <div className="absolute font-['Inter:Bold',_sans-serif] font-bold leading-[0] left-[42.756px] not-italic text-[#121722] text-[28.5042px] text-left text-nowrap top-[42.756px]">
          <p className="block leading-[normal] whitespace-pre">Invoice</p>
        </div>
        <div className="absolute font-['Inter:Bold',_sans-serif] font-bold leading-[0] left-[42.756px] not-italic text-[#121722] text-[18.5277px] text-left text-nowrap top-[319.247px]">
          <p className="block leading-[normal] whitespace-pre">Services</p>
        </div>
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic right-[371.059px] text-[#60737d] text-[14.2521px] text-nowrap text-right top-[322.097px]">
          <p className="block leading-[normal] whitespace-pre">Qty.</p>
        </div>
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic right-[206.86px] text-[#60737d] text-[14.2521px] text-nowrap text-right top-[322.097px]">
          <p className="block leading-[normal] whitespace-pre">Price</p>
        </div>
        <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic right-[42.961px] text-[#60737d] text-[14.2521px] text-nowrap text-right top-[322.097px]">
          <p className="block leading-[normal] whitespace-pre">Total</p>
        </div>
        <Frame12 />
        <Frame3 />
        <InvoiceItems />
        <Total1 />
        <Company />
      </div>
      <div className="absolute border-[#e5ebf3] border-[16.482px] border-solid inset-[-16.482px] pointer-events-none rounded-[47.8366px] shadow-[0px_3.2964px_19.7784px_0px_#000000]" />
    </div>
  );
}